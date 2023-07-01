pipeline {
    agent any
    
    environment {
        GIT_TAG = ''
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/develop']],
                    userRemoteConfigs: [[
                        url: 'git@github.com:LucasKoritar23/test-verse.git',
                        credentialsId: 'ssh-key-github'
                    ]]
                ])
            }
        }
        
        stage('Determine Version') {
            steps {
                script {
                    def tags = sh(returnStdout: true, script: 'git tag').trim().split('\n')
                    
                    if (tags.size() == 0) {
                        GIT_TAG = '1.0.0' // Defina a versão inicial se nenhuma tag existir
                    } else {
                        def latestTag = tags.last().replace('v', '')
                        GIT_TAG = incrementVersion(latestTag, 'PATCH') // Incrementa a versão existente
                    }
                    
                    def branches = sh(returnStdout: true, script: 'git ls-remote --heads origin | cut -d / -f 3-').trim().split('\n')
                    
                    branches.each { branch ->
                        if (branch == 'master') {
                            // Incrementa o número MAJOR para a branch 'master'
                            GIT_TAG = incrementVersion(GIT_TAG, 'MAJOR')
                        } else if (branch == 'develop') {
                            // Incrementa o número MINOR para as branches 'release/X.X'
                            GIT_TAG = incrementVersion(GIT_TAG, 'MINOR')
                        }
                        
                        def tagName = "v${GIT_TAG}"
                        
                        sh "git tag ${tagName}" // Cria a tag no Git
                        sh "git push origin ${tagName}" // Envia a tag para o repositório remoto
                    }
                }
            }
        }
        
        stage('Build and Push Docker Image') {
            steps {
                script {
                    def repository = "lucaskoritar23/test-verse" // Nome do seu repositório Docker Hub
                    
                    def tags = sh(returnStdout: true, script: 'git tag').trim().split('\n')
                    
                    tags.each { tag ->
                        def dockerTag = tag.replace('/', '-') // Nome da tag da imagem para o Docker Hub
                        
                        docker.withRegistry('https://registry.hub.docker.com', 'access-token-docker-hub') {
                            def dockerImage = docker.build("${repository}:${dockerTag}", ".") // Constrói a imagem Docker com a tag especificada
                            dockerImage.push() // Faz o push da imagem para o Docker Hub
                        }
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "Pipeline executada com sucesso!"
        }
        
        failure {
            echo "Falha na execução da pipeline"
        }
    }
}

def incrementVersion(version, level) {
    def versionArray = version.tokenize('.')
    
    switch (level) {
        case 'MAJOR':
            versionArray[0] = (versionArray[0] as int) + 1
            versionArray[1] = 0
            versionArray[2] = 0
            break
            
        case 'MINOR':
            versionArray[1] = (versionArray[1] as int) + 1
            versionArray[2] = 0
            break
            
        case 'PATCH':
            versionArray[2] = (versionArray[2] as int) + 1
            break
    }
    
    return versionArray.join('.')
}

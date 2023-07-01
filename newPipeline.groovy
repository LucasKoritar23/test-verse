pipeline {
    agent any

    environment {
        GIT_TAG = ''
        DB_USER = "$DB_USER"
        DB_HOST = "$DB_HOST"
        DB_DATABASE = "$DB_DATABASE"
        DB_PASSWORD = "$DB_PASSWORD"
        DB_PORT = "$DB_PORT"
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

        stage('Start Notify') {
            steps {
                sh '''
                        curl -s -X POST -H "Content-Type: application/json" -d '{
                            "username": "'${JOB_NAME}'",
                            "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jenkins_logo.svg/1200px-Jenkins_logo.svg.png",
                            "embeds": [{
                                "title": "Build Report",
                                "description": "Starting Build ⏳",
                                "color": 16776960,
                                "footer": {
                                    "text": "test-verse API"
                                },
                                "fields": [
                                    {
                                        "name": "Pipeline Name",
                                        "value": "'${JOB_NAME}'"
                                    },
                                    {
                                        "name": "Build ID",
                                        "value": "'${BUILD_ID}'"
                                    },
                                    {
                                        "name": "Pipeline URL",
                                        "value": "'${BUILD_URL}'"
                                    }
                                ]
                            }]
                        }' "$DISCORD_WEBHOOK_URL"
                    '''
            }
        }

        stage('Check Depencies for build') {
            steps {
                script {
                    sh 'docker -v'
                    sh 'docker-compose -v'
                    sh 'node -v'
                    sh 'npm -v'
                }
            }
        }

        stage('Set Version') {
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

                        def tagName = "${GIT_TAG}"

                        // Check if the tag already exists
                        def tagExists = sh(returnStatus: true, script: "git rev-parse --verify --quiet ${tagName}")

                        if (tagExists == 0) {
                            // Tag already exists, increment the tag name
                            GIT_TAG = incrementVersion(GIT_TAG, 'PATCH')
                            tagName = "${GIT_TAG}"
                        }

                        sshagent(credentials: ['ssh-key-github']) {
                            sh "git config user.name 'Jenkins Devops'"
                            sh "git config user.email '${GIT_EMAIL}'"
                            sh "git tag ${tagName}" // Create the tag in Git
                            sh "git push origin ${tagName}" // Push the tag to the remote repository
                        }
                    }
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    def repository = "$DOCKERHUB_USERNAME/test-verse" // Nome do seu repositório Docker Hub
                    docker.withRegistry('https://registry.hub.docker.com', 'access-token-docker-hub') {
                            def dockerImage = docker.build("${repository}:${GIT_TAG}", '.') // Constrói a imagem Docker com a tag especificada
                            dockerImage.push() // Faz o push da imagem para o Docker Hub
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executada com sucesso!'
            script {
                sh '''
                    curl -s -X POST -H "Content-Type: application/json" -d '{
                    "username": "'${JOB_NAME}'",
                    "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jenkins_logo.svg/1200px-Jenkins_logo.svg.png",
                    "embeds": [{
                        "title": "Build Report",
                        "description": "Build successful! :white_check_mark:",
                        "color": 65340,
                        "footer": {
                            "text": "test-verse API"
                        },
                        "fields": [
                            {
                                "name": "Pipeline Name",
                                "value": "'${JOB_NAME}'"
                            },
                            {
                                "name": "Image ID",
                                "value": "'${GIT_TAG}'"
                            },
                            {
                                "name": "Build ID",
                                "value": "'${BUILD_ID}'"
                            },
                            {
                                "name": "Pipeline URL",
                                "value": "'${BUILD_URL}'"
                            }
                        ]
                    }]
                }' "$DISCORD_WEBHOOK_URL"
            '''
            }
        }

        failure {
            echo 'Falha na execução da pipeline'
            sh '''
                curl -s -X POST -H "Content-Type: application/json" -d '{
                    "username": "'${JOB_NAME}'",
                    "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jenkins_logo.svg/1200px-Jenkins_logo.svg.png",
                    "embeds": [{
                        "title": "Build Report",
                        "description": "Build error! :frowning2:",
                        "color": 16711680,
                        "footer": {
                            "text": "test-verse API"
                        },
                        "fields": [
                            {
                                "name": "Pipeline Name",
                                "value": "'${JOB_NAME}'"
                            },
                            {
                                "name": "Build ID",
                                "value": "'${BUILD_ID}'"
                            },
                            {
                                "name": "Pipeline URL",
                                "value": "'${BUILD_URL}'"
                            }
                        ]
                    }]
                }' "$DISCORD_WEBHOOK_URL"
            '''
        }
    }
}

def incrementVersion(version, level) {
    if (version == null || version.trim().isEmpty()) {
        return '1.0.0'
    }

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

pipeline {
    agent any
        
    stages {
        stage('Checkout') {
            steps {
                 // Notify Discord that the build is starting
                sh "curl -X POST -H 'Content-Type: application/json' -d '{\"content\":\"Build starting...\"}' $DISCORD_WEBHOOK_URL"
                checkout([$class: 'GitSCM',
                          branches: [[name: '*/**']],
                          doGenerateSubmoduleConfigurations: false,
                          extensions: [[$class: 'CleanBeforeCheckout']],
                          submoduleCfg: [],
                          userRemoteConfigs: [[url: 'https://github.com/LucasKoritar23/test-verse.git']]])
            }
        }

        stage('Build') {
            steps {
                // Install Node.js dependencies
                sh 'npm install'
            }
        }

        stage('Release') {
            steps {
                script {
                    def version = sh(script: 'echo $BUILD_NUMBER', returnStdout: true).trim()
                    sh 'git config --global user.name "DevOps"'
                    sh 'git config --global user.email "$EMAIL"'
                    sh "git tag -a ${version}"
                    sh "git push origin refs/tags/${version}"
                    sh "curl -X POST -H 'Content-Type: application/json' -d '{\"content\":\"New release generated: ${version}\"}' $DISCORD_WEBHOOK_URL"
                }
            }
        }
    }

    post {
        success {
            // Notify Discord on build success
            sh "curl -X POST -H 'Content-Type: application/json' -d '{\"content\":\"Build successful!\"}' $DISCORD_WEBHOOK_URL"
        }

        failure {
            // Notify Discord on build failure
            sh "curl -X POST -H 'Content-Type: application/json' -d '{\"content\":\"Build failed!\"}' $DISCORD_WEBHOOK_URL"
        }
    }
}

pipeline {
    agent any

    triggers {
        cron('* * * * *')
    }
    
    stages {
        stage('Checkout') {
            steps {
                 // Notify Discord that the build is starting
                sh "curl -X POST -H 'Content-Type: application/json' -d '{\"content\":\"Build starting...\"}' $DISCORD_WEBHOOK_URL"
                checkout scm
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
                // Generate a release tag
                sh 'TAG=$(date "+%Y%m%d%H%M%S") && git tag $TAG && git push origin $TAG'

                // Notify Discord about the release
                sh "curl -X POST -H 'Content-Type: application/json' -d '{\"content\":\"New release generated: $TAG\"}' $DISCORD_WEBHOOK_URL"
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

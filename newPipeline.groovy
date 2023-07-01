pipeline {
    agent any

    environment {
        GIT_TAG = ''
        DB_USER = sh(returnStdout: true, script: 'echo $DB_USER').trim()
        DB_HOST = sh(returnStdout: true, script: 'echo $DB_HOST').trim()
        DB_DATABASE = sh(returnStdout: true, script: 'echo $DB_DATABASE').trim()
        DB_PASSWORD = sh(returnStdout: true, script: 'echo $DB_PASSWORD').trim()
        DB_PORT = sh(returnStdout: true, script: 'echo $DB_PORT').trim()
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
                script {
                    def discordWebhookUrl = "$DISCORD_WEBHOOK_URL"
                    def jobName = "${JOB_NAME}"
                    def buildId = "${BUILD_ID}"
                    def buildUrl = "${BUILD_URL}"

                    sh """
                        curl -s -X POST -H 'Content-Type: application/json' -d '{
                            "username": "$jobName",
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
                                        "value": "$jobName"
                                    },
                                    {
                                        "name": "Build ID",
                                        "value": "$buildId"
                                    },
                                    {
                                        "name": "Pipeline URL",
                                        "value": "$buildUrl"
                                    }
                                ]
                            }]
                        }' "$discordWebhookUrl"
                    """
                }
            }
        }

        stage('Check Dependencies for Build') {
            steps {
                sh 'docker -v'
                sh 'docker-compose -v'
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Set Version') {
            steps {
                script {
                    def tags = sh(returnStdout: true, script: 'git tag').trim().split('\n')

                    if (tags.size() == 0) {
                        GIT_TAG = '1.0.0' // Set the initial version if no tags exist
                    } else {
                        def latestTag = tags.last().replace('v', '')
                        GIT_TAG = getIncrementedVersion(latestTag, 'PATCH') // Increment the existing version
                    }

                    def branches = sh(returnStdout: true, script: 'git ls-remote --heads origin | cut -d / -f 3-').trim().split('\n')

                    branches.each { branch ->
                        if (branch == 'master') {
                            // Increment the MAJOR number for the 'master' branch
                            GIT_TAG = getIncrementedVersion(GIT_TAG, 'MAJOR')
                        } else if (branch == 'develop') {
                            // Increment the MINOR number for the 'develop' branch
                            GIT_TAG = getIncrementedVersion(GIT_TAG, 'MINOR')
                        }

                        def tagName = "${GIT_TAG}"

                        // Check if the tag already exists
                        def tagExists = sh(
                            returnStatus: true,
                            script: "git ls-remote --tags origin refs/tags/${tagName}"
                        )

                        if (tagExists != 0) {
                            // Tag does not exist, create the tag
                            sshagent(credentials: ['ssh-key-github']) {
                                sh "git config user.name 'Jenkins Devops'"
                                sh "git config user.email '${GIT_EMAIL}'"
                                sh "git tag ${tagName}" // Create the tag in Git
                                sh "git push origin ${tagName}" // Push the tag to the remote repository
                            }
                        } else {
                            echo "Tag ${tagName} already exists, skipping tag creation."
                        }
                    }
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    def repository = "$DOCKERHUB_USERNAME/test-verse"
                    def dockerTag = "${GIT_TAG}"
                    def dockerHubToken = 'access-token-docker-hub'

                    docker.withRegistry('https://registry.hub.docker.com', dockerHubToken) {
                        def dockerImage = docker.build("${repository}:${dockerTag}", '.')
                        dockerImage.push()
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
            script {
                def discordWebhookUrl = "$DISCORD_WEBHOOK_URL"
                def jobName = "${JOB_NAME}"
                def buildId = "${BUILD_ID}"
                def buildUrl = "${BUILD_URL}"
                def gitTag = "${GIT_TAG}"

                sh """
                    curl -s -X POST -H 'Content-Type: application/json' -d '{
                        "username": "$jobName",
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
                                    "value": "$jobName"
                                },
                                {
                                    "name": "Image ID",
                                    "value": "$gitTag"
                                },
                                {
                                    "name": "Build ID",
                                    "value": "$buildId"
                                },
                                {
                                    "name": "Pipeline URL",
                                    "value": "$buildUrl"
                                }
                            ]
                        }]
                    }' "$discordWebhookUrl"
                """
            }
        }

        failure {
            echo 'Pipeline execution failed!'
            script {
                def discordWebhookUrl = "$DISCORD_WEBHOOK_URL"
                def jobName = "${JOB_NAME}"
                def buildId = "${BUILD_ID}"
                def buildUrl = "${BUILD_URL}"

                sh """
                    curl -s -X POST -H 'Content-Type: application/json' -d '{
                        "username": "$jobName",
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
                                    "value": "$jobName"
                                },
                                {
                                    "name": "Build ID",
                                    "value": "$buildId"
                                },
                                {
                                    "name": "Pipeline URL",
                                    "value": "$buildUrl"
                                }
                            ]
                        }]
                    }' "$discordWebhookUrl"
                """
            }
        }
    }
}

def getIncrementedVersion(version, level = 'PATCH') {
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
        default:
            versionArray[2] = (versionArray[2] as int) + 1
            break
    }

    return versionArray.join('.')
}

pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                dir('/var/www/aryu_resumebuilder/resumebuilderapi-nodejs') {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        userRemoteConfigs: [[
                            url: 'https://github.com/aryuenterprises/resumebuilder-api.git',
                            credentialsId: 'github-ayhrms'
                        ]]
                    ])
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('/var/www/aryu_resumebuilder/resumebuilderapi-nodejs') {
                    sh 'npm install'
                }
            }
        }

        stage('Restart Backend') {
            steps {
                dir('/var/www/aryu_resumebuilder/resumebuilderapi-nodejs') {
                    sh '''
                        pm2 delete resumebuilder-api || true
                        pm2 start node_modules/tsx/dist/cli.cjs --name resumebuilder-api -- src/index.ts
                        pm2 save
                    '''
                }
            }
        }
    }
}

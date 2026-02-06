pipeline {
    agent any

    environment {
        PROJECT_DIR = "/var/www/aryu_resumebuilder/resumebuilderapi-nodejs"
        APP_NAME    = "resumebuilder-api"
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh """
                    cd $PROJECT_DIR
                    npm install
                """
            }
        }

        stage('Restart Backend (PM2)') {
            steps {
                sh """
                    cd $PROJECT_DIR
                    pm2 delete $APP_NAME || true
                    pm2 start node_modules/tsx/dist/cli.cjs --name $APP_NAME -- src/index.ts
                    pm2 save
                """
            }
        }

        stage('Verify Running') {
            steps {
                sh """
                    pm2 show $APP_NAME
                    ss -lntp | grep 3015 || true
                """
            }
        }
    }
}


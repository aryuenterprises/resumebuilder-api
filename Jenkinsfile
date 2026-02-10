pipeline {
    agent any

    environment {
        APP_NAME    = "resumebuilder-api"
        BUILD_DIR  = "/var/lib/jenkins/workspace/Ai-Resumebuilder-backend"
        RUNTIME_DIR = "/var/www/aryu_resumebuilder/resumebuilderapi-nodejs"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh """
                    cd $BUILD_DIR
                    npm install
                """
            }
        }

        stage('Build') {
            steps {
                sh """
                    cd $BUILD_DIR
                    npm run build
                """
            }
        }

        stage('Sync to Runtime Directory') {
            steps {
                sh """
                    rsync -av --delete \
                      --exclude node_modules \
                      $BUILD_DIR/ \
                      $RUNTIME_DIR/
                """
            }
        }

        stage('Restart Backend (PM2)') {
            steps {
                sh """
                    cd $RUNTIME_DIR
                    pm2 delete $APP_NAME || true
                    pm2 start dist/index.js --name $APP_NAME
                    pm2 save
                """
            }
        }

        stage('Verify Running') {
            steps {
                sh """
                    echo "=== BUILD COMMIT ==="
                    cd $BUILD_DIR
                    git rev-parse HEAD

                    echo "=== RUNTIME COMMIT ==="
                    cd $RUNTIME_DIR
                    git rev-parse HEAD

                    pm2 show $APP_NAME
                    ss -lntp | grep 3015 || true
                """
            }
        }
    }
}

pipeline {
  agent any

  tools {
    nodejs "node18"
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Restart Server') {
      steps {
        sh '''
          pm2 restart resumebuilder-api || pm2 start dist/index.js --name resumebuilder-api
        '''
      }
    }
  }
}


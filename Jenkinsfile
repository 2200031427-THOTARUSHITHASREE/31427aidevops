pipeline {
    agent any

    environment {
        IMAGE_NAME = 'incident-devops'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git credentialsId: 'd95bd2b8-f628-4cd9-988e-6838ef170440', url: 'https://github.com/2200031427-THOTARUSHITHASREE/31427aidevops'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $IMAGE_NAME .'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    sh 'docker stop $IMAGE_NAME || true'
                    sh 'docker rm $IMAGE_NAME || true'
                    sh 'docker run -d -p 5050:5050 --name $IMAGE_NAME $IMAGE_NAME'
                }
            }
        }
    }
}

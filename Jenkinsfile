pipeline {
  agent any
  parameters {
    booleanParam(name: 'USE_MINIKUBE_LOAD', defaultValue: true, description: 'Load image into Minikube instead of Docker Hub push')
  }
  environment {
    DOCKERHUB_REPO = "santhoshmula/devopstrainer-myrepo"
    IMAGE_TAG = "${BUILD_NUMBER}"
    IMAGE_NAME = "${DOCKERHUB_REPO}:${IMAGE_TAG}"
    K8S_DIR = "k8s"
  }
  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Docker Login') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          bat 'echo %DH_PASS% | docker login -u %DH_USER% --password-stdin'
        }
      }
    }

    tage('Build Image') {
      steps {
        dir('app') {
          // debug - remove after verifying
          bat 'echo DOCKERHUB_REPO=%DOCKERHUB_REPO%'
          bat 'echo IMAGE_NAME=%IMAGE_NAME%|xx'
          bat 'dir'
          // actual build - note quoted IMAGE_NAME
          bat 'docker build -t "%IMAGE_NAME%" .'
        }
      }
    }

    stage('Publish or Load') {
      steps {
        script {
          if (params.USE_MINIKUBE_LOAD.toBoolean()) {
            bat "minikube image load %DOCKERHUB_REPO%:%BUILD_NUMBER%"
          } else {
            bat "docker push %DOCKERHUB_REPO%:%BUILD_NUMBER%"
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        withCredentials([file(credentialsId: 'minikube-kubeconfig', variable: 'KUBECONFIG_FILE')]) {
          bat """
            mkdir "%USERPROFILE%\\.kube" 2>nul || echo ok
            copy "%KUBECONFIG_FILE%" "%USERPROFILE%\\.kube\\config" /Y
            kubectl apply -f %K8S_DIR%\\deployment.yaml
            kubectl apply -f %K8S_DIR%\\service.yaml
            kubectl set image deployment/ecommerce ecommerce=%DOCKERHUB_REPO%:%BUILD_NUMBER% --record || echo "set-image failed"
            kubectl rollout status deployment/ecommerce --timeout=120s
            kubectl get pods -l app=ecommerce -o wide
          """
        }
      }
    }
  }
  post {
    success { echo 'Pipeline success' }
    failure { echo 'Pipeline failed' }
  }
}

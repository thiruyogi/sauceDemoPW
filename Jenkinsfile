pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    environment {
        CI = 'true'
        HEADLESS = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                    @echo on
                    setlocal EnableDelayedExpansion
                    echo PATH=%PATH%
                    where node
                    where npm
                    node -v
                    call npm -v
                    if errorlevel 1 exit /b 1
                    if exist package-lock.json (
                        echo package-lock.json found, running npm ci
                        call npm ci
                    ) else (
                        echo package-lock.json not found, running npm install
                        call npm install
                    )
                    if errorlevel 1 exit /b 1
                '''
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat '''
                    @echo on
                    call npx playwright install
                    if errorlevel 1 exit /b 1
                '''
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat '''
                    @echo on
                    call npx playwright test
                    if errorlevel 1 exit /b 1
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**, test-results/**', allowEmptyArchive: true
            // publishHTML(target: [
            //     allowMissing: true,
            //     alwaysLinkToLastBuild: true,
            //     keepAll: true,
            //     reportDir: 'playwright-report',
            //     reportFiles: 'index.html',
            //     reportName: 'Playwright HTML Report'
            // ])
        }
    }
}

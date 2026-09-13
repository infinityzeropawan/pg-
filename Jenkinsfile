pipeline {
    agent any

    // Yahan hum explicitly define kar rahe hain ki kaunsi app kis port par chalegi
    environment {
        FRONTEND_PORT = '3004'
        // Ye line Jenkins ko order deti hai ki PM2 ko kill mat karna!
        JENKINS_NODE_COOKIE = 'dontKillMe' 
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out vps branch from Git...'
                git branch: 'vps', url: 'https://github.com/apanaTimeWeb/Pg-Management.git'
            }
        }

        // ==========================================
        // FRONTEND STAGES (Next.js)
        // ==========================================
        stage('Frontend: Install & Build') {
            steps {
                echo 'Installing Next.js dependencies...'
                sh 'cd frontend && npm install'
                
                echo 'Building Next.js for production...'
                sh 'cd frontend && npm run build' 
            }
        }

        stage('Deploy: Frontend (PM2)') {
            steps {
                echo "Deploying Next.js Frontend to PM2 on Port ${FRONTEND_PORT}..."
                // PORT variable force karega Next.js ko define kiye gaye port par chalne ke liye
                sh 'cd frontend && PORT=$FRONTEND_PORT pm2 restart next-frontend-pgmanagement || cd frontend && PORT=$FRONTEND_PORT pm2 start npm --name "next-frontend-pgmanagement" -- run start'
            }
        }


        // ==========================================
        // SAVE SERVER STATE
        // ==========================================
        stage('Save PM2 State') {
            steps {
                echo 'Saving PM2 process list so they auto-start on server reboot...'
                sh 'pm2 save'
            }
        }
    }
}
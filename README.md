# 🩸 Blood Donation System - Cloud Edition

A secure, scalable, and highly available web application designed to bridge the gap between donors and hospitals.  
This project demonstrates the transition from a local backend to a professional AWS Cloud Infrastructure using Infrastructure as Code (IaC).

---

## 🏗 Architecture Overview

The system is deployed in the **AWS Asia Pacific (Singapore)** region using a multi-layered network design:

- **High Availability:** Distributed across two Availability Zones (AZs)
- **Auto-Scaling:** Automatically adjusts server capacity based on demand
- **Security:** Database is isolated in a private subnet, accessible only by the backend
- **Automation:** Fully provisioned via Terraform

---

## 🚀 Technologies Used

- **Backend:** Node.js, Express  
- **Process Management:** PM2  
- **Database:** Amazon RDS (PostgreSQL/MySQL)  
- **Infrastructure:** Terraform (IaC)  
- **Cloud Provider:** AWS (EC2, ALB, ASG, VPC, IAM, CloudWatch)

---

## 💻 Local Installation

To run the project locally for development:

### 1. Clone the Repository

```bash
git clone https://github.com/ChhengHab17/Blood_donation_system.git
cd Blood_donation_system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=your_database_endpoint
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=blood_donation_db
```

### 4. Run the Application

```bash
node index.js
```

---

## ☁️ AWS Cloud Deployment (via Terraform)

The infrastructure is fully automated. Follow these steps to deploy to AWS:

### 1. Prerequisites

- An AWS Account  
- AWS CLI configured with appropriate credentials  
- Terraform installed on your local machine  

### 2. Initialize and Deploy

```bash
# Initialize Terraform and download providers
terraform init

# Review the infrastructure plan
terraform plan

# Deploy the infrastructure to AWS
terraform apply -auto-approve
```

### 3. Application Bootstrapping

Once `terraform apply` is complete:

- The Auto Scaling Group launches two EC2 instances  
- The User Data script installs Node.js and PM2 automatically  
- The script clones this repo and starts the backend on port 3000  
- The Application Load Balancer (ALB) provides a public DNS URL  

---

## 🛡 Security & Resilience

- **Network Isolation:** RDS has no public IP and runs in a private subnet  
- **Chain of Trust:**
  - Database only accepts traffic from EC2  
  - EC2 only accepts traffic from ALB  
- **Self-Healing:** Auto Scaling replaces failed EC2 instances automatically  

---

## 📊 Monitoring

System health is tracked via Amazon CloudWatch:

- CPU Utilization  
- ALB Request Count  
- Target Group Health Status  

---

## 💰 Cost Estimation (Singapore Region)

- **Estimated Monthly Cost:** ~$84.47 (On-Demand)  
- **Optimization:** Using AWS Free Tier (`t3.micro`) can significantly reduce costs for the first 12 months  

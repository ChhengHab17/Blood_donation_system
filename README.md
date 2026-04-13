# 🩸 Blood Donation System

A RESTful backend API for managing blood donation operations, built with **Node.js** and **PostgreSQL**, deployed on AWS using Terraform.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Database | PostgreSQL 15 |
| Authentication | JWT |
| Infrastructure | Terraform |
| Cloud | AWS (ap-southeast-1) |

---

## AWS Services

**VPC** — Isolated network with public and private subnets across 2 Availability Zones. EC2 and RDS live in private subnets; only the ALB is public-facing.

**Application Load Balancer (ALB)** — Receives all incoming HTTP traffic on port 80 and distributes it across healthy EC2 instances. Performs health checks on `/health`.

**Auto Scaling Group (ASG)** — Keeps 1–3 EC2 instances (`t3.micro`) running at all times. Automatically replaces unhealthy instances and supports rolling updates.

**RDS PostgreSQL** — Managed PostgreSQL 15 database (`db.t3.micro`, 20 GB) in a private subnet. Only accessible from EC2 instances within the VPC.

**IAM** — EC2 instances are assigned a role with SSM access, allowing remote session management without opening SSH ports.

**Security Groups** — Three separate security groups for ALB (public HTTP/HTTPS), EC2 (traffic from ALB only), and RDS (traffic from EC2 only).

**CloudWatch** — Collects application and RDS logs, provides a monitoring dashboard, and sends email alerts for critical events such as unhealthy hosts, low storage, and high error rates.

**SNS** — Delivers CloudWatch alarm notifications to the configured email address.

---

## Getting Started

```bash
git clone https://github.com/ChhengHab17/Blood_donation_system.git
cd Blood_donation_system/medical_staff/backend
npm install
cp .env.example .env   # fill in your DB and JWT values
npm run db:init
npm start
```

---

## Infrastructure Deployment

```bash
terraform init
terraform plan
terraform apply
```

After apply, the ALB DNS name is printed as output — that is your API base URL.

---

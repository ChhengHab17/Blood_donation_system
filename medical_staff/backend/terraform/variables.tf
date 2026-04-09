variable "instance_name" {
  description = "Value of the EC2 instance's Name tag."
  type        = string
  default     = "Cloud final Project"
}

variable "instance_type" {
  description = "The EC2 instance's type."
  type        = string
  default     = "t3.micro"
}
variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "ap-southeast-1"
}

// Security group variables
variable "alb_sg_name" {
  description = "Name of the ALB security group."
  type        = string
  default     = "alb-sg"
}
variable "ec2_sg_name" {
  description = "Name of the EC2 security group."
  type        = string
  default     = "ec2-sg"
}
variable "rds_sg_name" {
  description = "Name of the RDS security group."
  type        = string
  default     = "rds-sg"
}
variable "db_username" {}
variable "db_password" {
  sensitive = true
}
variable "db_name" {}

variable "app_repo_url" {
  description = "Git repository URL that contains the backend code."
  type        = string
  default     = "https://github.com/ChhengHab17/Blood_donation_system.git"
}

variable "app_repo_branch" {
  description = "Git branch to deploy from the repository."
  type        = string
  default     = "main"
}

variable "app_repo_subdir" {
  description = "Path to backend directory inside the repository."
  type        = string
  default     = "medical_staff/backend"
}

variable "app_port" {
  description = "Port exposed by the backend application."
  type        = number
  default     = 3000
}

variable "jwt_secret" {
  description = "JWT signing secret for backend authentication."
  type        = string
  sensitive   = true
}

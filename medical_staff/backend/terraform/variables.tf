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
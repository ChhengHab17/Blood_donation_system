output "instance_hostname" {
  description = "Private DNS name of the EC2 instance."
  value       = aws_instance.app_server.private_dns
}

# Load Balancer output (to access your app)
output "alb_dns_name" {
  value = aws_lb.app_alb.dns_name
}
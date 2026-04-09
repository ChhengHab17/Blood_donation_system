# ASG outputs
output "asg_name" {
  value = aws_autoscaling_group.app_asg.name
}

output "launch_template_id" {
  value = aws_launch_template.app_lt.id
}

# Load Balancer output (to access your app)
output "alb_dns_name" {
  value = aws_lb.app_alb.dns_name
}

# RDS output
output "db_host" {
  value = aws_db_instance.db.address
}
output "instance_hostname" {
  description = "Private DNS name of the EC2 instance."
  value       = aws_instance.app_server.private_dns
}

# Load Balancer output (to access your app)
output "alb_dns_name" {
  value = aws_lb.app_alb.dns_name
}

output "cloudwatch_dashboard_url" {
  description = "Direct link to the CloudWatch dashboard."
  value       = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=blood-donation-dashboard"
}

output "sns_alerts_topic_arn" {
  description = "SNS topic ARN used for all CloudWatch alarms."
  value       = aws_sns_topic.alerts.arn
}
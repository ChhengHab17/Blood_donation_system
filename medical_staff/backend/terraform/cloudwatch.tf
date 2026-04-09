resource "aws_sns_topic" "alerts" {
  name = "blood-donation-alerts"
}

resource "aws_sns_topic_subscription" "email_alert" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

resource "aws_iam_role_policy_attachment" "cloudwatch_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

# Log Groups
resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/blood-donation/backend"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "rds_logs" {
  name              = "/blood-donation/rds/postgresql"
  retention_in_days = 30
}

# Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "blood-donation-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      # ALB Widgets
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "ALB — Healthy vs Unhealthy Hosts"
          region = var.aws_region
          metrics = [
            ["AWS/ApplicationELB", "HealthyHostCount",
              "TargetGroup", aws_lb_target_group.app_tg.arn_suffix,
              "LoadBalancer", aws_lb.app_alb.arn_suffix,
              { stat = "Average", period = 60, color = "#2ca02c", label = "Healthy" }],
            ["AWS/ApplicationELB", "UnHealthyHostCount",
              "TargetGroup", aws_lb_target_group.app_tg.arn_suffix,
              "LoadBalancer", aws_lb.app_alb.arn_suffix,
              { stat = "Average", period = 60, color = "#d62728", label = "Unhealthy" }]
          ]
          view = "timeSeries"
        }
      },
      # ASG Widget (replaces single EC2 instance widgets)
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "ASG — In Service Instances"
          region = var.aws_region
          metrics = [
            ["AWS/AutoScaling", "GroupInServiceInstances",
              "AutoScalingGroupName", aws_autoscaling_group.app_asg.name,
              { stat = "Average", period = 60, label = "In-service count" }]
          ]
          view = "timeSeries"
        }
      },
      # RDS Widgets
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          title  = "RDS — Database Connections"
          region = var.aws_region
          metrics = [
            ["AWS/RDS", "DatabaseConnections",
              "DBInstanceIdentifier", aws_db_instance.db.identifier,
              { stat = "Average", period = 60, label = "Connections" }]
          ]
          view = "timeSeries"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          title  = "RDS — Free Storage Space"
          region = var.aws_region
          metrics = [
            ["AWS/RDS", "FreeStorageSpace",
              "DBInstanceIdentifier", aws_db_instance.db.identifier,
              { stat = "Average", period = 300, label = "Free storage (bytes)" }]
          ]
          view = "timeSeries"
        }
      },
      # Log Widget
      {
        type   = "log"
        x      = 0
        y      = 12
        width  = 24
        height = 6
        properties = {
          title  = "App Logs — blood-backend (last 20 lines)"
          region = var.aws_region
          query  = "SOURCE '/blood-donation/backend' | fields @timestamp, @message | sort @timestamp desc | limit 20"
          view   = "table"
        }
      }
    ]
  })
}

# Alarms
resource "aws_cloudwatch_metric_alarm" "alb_unhealthy_hosts" {
  alarm_name          = "alb-unhealthy-hosts"
  alarm_description   = "One or more EC2 targets are failing ALB health checks."
  namespace           = "AWS/ApplicationELB"
  metric_name         = "UnHealthyHostCount"
  dimensions = {
    TargetGroup  = aws_lb_target_group.app_tg.arn_suffix
    LoadBalancer = aws_lb.app_alb.arn_suffix
  }
  statistic           = "Average"
  period              = 60
  evaluation_periods  = 2
  threshold           = 0
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "asg_min_instances" {
  alarm_name          = "asg-below-minimum-instances"
  alarm_description   = "ASG has fewer than 1 instance in service — possible total outage."
  namespace           = "AWS/AutoScaling"
  metric_name         = "GroupInServiceInstances"
  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.app_asg.name
  }
  statistic           = "Average"
  period              = 60
  evaluation_periods  = 2
  threshold           = 1
  comparison_operator = "LessThanThreshold"
  treat_missing_data  = "breaching"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "rds_storage_low" {
  alarm_name          = "rds-free-storage-low"
  alarm_description   = "RDS free storage is below 2 GB — consider increasing allocated_storage."
  namespace           = "AWS/RDS"
  metric_name         = "FreeStorageSpace"
  dimensions = {
    DBInstanceIdentifier = aws_db_instance.db.identifier
  }
  statistic           = "Average"
  period              = 300
  evaluation_periods  = 2
  threshold           = 2147483648 # 2 GB in bytes
  comparison_operator = "LessThanThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "rds_connections_high" {
  alarm_name          = "rds-connections-high"
  alarm_description   = "RDS has more than 80 open connections — near the db.t3.micro limit."
  namespace           = "AWS/RDS"
  metric_name         = "DatabaseConnections"
  dimensions = {
    DBInstanceIdentifier = aws_db_instance.db.identifier
  }
  statistic           = "Average"
  period              = 60
  evaluation_periods  = 3
  threshold           = 80
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_log_metric_filter" "app_errors" {
  name           = "blood-backend-errors"
  log_group_name = aws_cloudwatch_log_group.app_logs.name
  pattern        = "ERROR"

  metric_transformation {
    name      = "AppErrorCount"
    namespace = "BloodDonation/Backend"
    value     = "1"
  }
}

resource "aws_cloudwatch_metric_alarm" "app_error_rate" {
  alarm_name          = "app-error-rate-high"
  alarm_description   = "More than 20 ERROR log lines in 5 minutes."
  namespace           = "BloodDonation/Backend"
  metric_name         = "AppErrorCount"
  statistic           = "Sum"
  period              = 300
  evaluation_periods  = 1
  threshold           = 20
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
}
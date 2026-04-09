provider "aws" {
  region = var.aws_region
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_launch_template" "app_lt" {
  name_prefix   = "app_server"
  image_id      = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  vpc_security_group_ids = [aws_security_group.ec2_sg.id]

  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_profile.name
  }

  user_data = base64encode(<<-EOF
#!/bin/bash
set -euxo pipefail

LOG="/var/log/app-deploy.log"
exec > >(tee -a "$${LOG}") 2>&1
echo "========== Deploy started at $(date -u) =========="

export DEBIAN_FRONTEND=noninteractive

echo ">>> Installing system packages..."
apt-get update -y
apt-get install -y ca-certificates curl git gnupg netcat-openbsd

echo ">>> Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
echo "Node version: $(node --version)"
echo "npm  version: $(npm --version)"

APP_ROOT="/opt/blood_donation_system"
APP_DIR="$${APP_ROOT}/${var.app_repo_subdir}"

echo ">>> Cloning repository..."
rm -rf "$${APP_ROOT}"
git clone --depth 1 --branch "${var.app_repo_branch}" "${var.app_repo_url}" "$${APP_ROOT}"

if [ ! -d "$${APP_DIR}" ]; then
  echo "FATAL: App directory $${APP_DIR} not found after clone!"
  exit 1
fi

cd "$${APP_DIR}"

echo ">>> Installing npm dependencies..."
if [ -f package-lock.json ]; then
  npm ci --omit=dev
else
  npm install --omit=dev
fi

if [ ! -d node_modules ]; then
  echo "FATAL: node_modules missing after npm install!"
  exit 1
fi

echo ">>> Writing .env file..."
cat > .env <<ENVVARS
PORT=${var.app_port}
DB_HOST=${aws_db_instance.db.address}
DB_PORT=5432
DB_NAME=${var.db_name}
DB_USER=${var.db_username}
DB_PASSWORD=${var.db_password}
DB_ADMIN_NAME=${var.db_username}
DB_CREATE_IF_MISSING=false
DB_INIT_LOCK_KEY=blood_donation_system_init_lock
AUTO_INIT_DB_ON_START=true
JWT_SECRET=${var.jwt_secret}
ENVVARS

echo ">>> Waiting for RDS at ${aws_db_instance.db.address}:5432..."
rds_ready=0
for i in $(seq 1 30); do
  if nc -zw5 ${aws_db_instance.db.address} 5432 2>&1; then
    echo "RDS is reachable after $${i} attempts"
    rds_ready=1
    break
  fi
  echo "RDS not reachable yet, attempt $${i}/30, retrying in 10s..."
  sleep 10
done

if [ "$${rds_ready}" -ne 1 ]; then
  echo "FATAL: RDS not reachable after 5 minutes — aborting."
  exit 1
fi

echo ">>> Running db:init..."
db_init_ok=0
for i in $(seq 1 10); do
  if npm run db:init 2>&1; then
    echo "db:init succeeded on attempt $${i}"
    db_init_ok=1
    break
  fi
  echo "db:init attempt $${i}/10 failed; retrying in 10s"
  sleep 10
done

if [ "$${db_init_ok}" -ne 1 ]; then
  echo "WARNING: db:init failed after all retries — app will attempt init on startup"
fi

echo ">>> Creating systemd service..."
cat > /etc/systemd/system/blood-backend.service <<SERVICE
[Unit]
Description=Blood Donation Backend API
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=$${APP_DIR}
EnvironmentFile=$${APP_DIR}/.env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StartLimitIntervalSec=300
StartLimitBurst=10
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable blood-backend
systemctl restart blood-backend

echo ">>> Verifying service started..."
sleep 5
if systemctl is-active --quiet blood-backend; then
  echo "blood-backend is RUNNING"
else
  echo "WARNING: blood-backend failed to start. Dumping logs:"
  journalctl -u blood-backend --no-pager -n 50
fi

echo "========== Deploy finished at $(date -u) =========="
EOF
  )

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name = var.instance_name
    }
  }
}
resource "aws_autoscaling_group" "app_asg" {
  desired_capacity = 2
  max_size         = 3
  min_size         = 1

  vpc_zone_identifier = module.vpc.private_subnets

  launch_template {
    id      = aws_launch_template.app_lt.id
    version = "$Latest"
  }

  target_group_arns = [aws_lb_target_group.app_tg.arn]
  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 50
      instance_warmup = 300
    }
  }
  depends_on = [aws_db_instance.db]
}
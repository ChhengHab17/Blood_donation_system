resource "aws_db_subnet_group" "db_subnet" {
  name       = "myapp-db-subnet"
  subnet_ids = module.vpc.private_subnets
}
resource "aws_db_instance" "db" {
  engine         = "postgres"
  engine_version    = "15"
  instance_class = "db.t3.micro"
  allocated_storage = 20


  db_name       = var.db_name
  username      = var.db_username
  password      = var.db_password
  skip_final_snapshot = true

  db_subnet_group_name = aws_db_subnet_group.db_subnet.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
}
resource "aws_db_instance" "cal_del_db" {
  identifier        = "cal-del-db"
  allocated_storage = 20
  db_name           = "mydb"
  engine            = "postgres"
  engine_version    = "18.3"
  instance_class    = "db.t3.micro"
  username          = "foo"
  password          = "foobarbaz"
  storage_type      = "gp3"

  publicly_accessible = true
  skip_final_snapshot = true
  multi_az            = false
}
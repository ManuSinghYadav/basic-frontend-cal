provider "aws" {
  region = "ap-south-1"
}

# Read-only lookup (Safe from terraform destroy)
data "aws_iam_user" "existing_user" {
  user_name = "cal-del"
}

resource "aws_ecr_repository" "ecr-cal-del" {
  name                 = "cal-del-image"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

}

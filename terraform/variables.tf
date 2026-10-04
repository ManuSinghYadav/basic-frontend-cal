variable "environment" {
  type        = string
  default     = "dev"
  description = "Deployment environment tag"
}

variable "project_name" {
  type    = string
  default = "cal-del"
}

variable "container_image" {
  type        = string
  description = "Full ECR container image URI"
  default     = "592964950477.dkr.ecr.ap-south-1.amazonaws.com/cal-del-image:latest"
}

variable "db_url" {
  type        = string
  description = "Full ECR container image URI"
}

variable "next_public_clerk_publishable_key" {
  type        = string
  description = "Clerk's public key"
  default     = "pk_test_bWVhc3VyZWQtcmFjZXItMTcyNS5jbGVyay5hY2NvdW50cy5kZXYk"
}

variable "clerk_secret_key" {
  type        = string
}

variable "environment" {
  type        = string
  default     = "dev"
  description = "Deployment environment tag"
}

variable "project_name" {
  type        = string
  default     = "cal-del"
}

variable "container_image" {
  type        = string
  description = "Full ECR container image URI"
  default     = "592964950477.dkr.ecr.ap-south-1.amazonaws.com/cal-del-image:latest"
}

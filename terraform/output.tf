output "repository_url" {
  value       = aws_ecr_repository.ecr-cal-del.repository_url
  description = "The URL of the repository used for Docker logins and pushes"
}

output "repository_arn" {
  value       = aws_ecr_repository.ecr-cal-del.arn
  description = "The ARN of the repository"
}
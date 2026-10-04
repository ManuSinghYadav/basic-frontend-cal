# 1. Create ECS Cluster
resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# 2. IAM Roles for ECS Task Execution
resource "aws_iam_role" "ecs_execution_role" {
  name = "${var.project_name}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = { Service = "ecs-tasks.amazonaws.com" }
      }
    ]
  })
}

# Attach Managed Policy to Execution Role (Allows image pull & logs)
resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# 3. Security Group for ECS Tasks
resource "aws_security_group" "ecs_tasks_sg" {
  name        = "${var.project_name}-tasks-sg"
  description = "Allow inbound traffic on port 8000 and all outbound traffic"
  vpc_id      = "vpc-08f987f226067aa8c"

  ingress {
    description = "Allow inbound on port 8000"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. Create ECS Task Definition
resource "aws_ecs_task_definition" "ecs_task" {
  family                   = "${var.project_name}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  runtime_platform {
    cpu_architecture = "ARM64"
  }

  container_definitions = jsonencode([
    {
      name      = "${var.project_name}-container"
      image     = var.container_image
      essential = true

      # Plain-text environment variables
      environment = [
        { name = "DB_URL", value = var.db_url },
        { name = "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", value = var.next_public_clerk_publishable_key },
        { name = "CLERK_SECRET_KEY", value = var.clerk_secret_key }
      ]

      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
          protocol      = "tcp"
        }
      ]
    }
  ])

}

# 5. ECS Fargate Service
resource "aws_ecs_service" "ecs_service" {
  name            = "${var.project_name}-${var.environment}-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.ecs_task.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = ["subnet-0c66c0b7a77dba068", "subnet-05a166a717e8ed23f", "subnet-0fc97f2cb6e491ef9"]
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = true
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  depends_on = [aws_iam_role_policy_attachment.ecs_execution_role_policy]
}

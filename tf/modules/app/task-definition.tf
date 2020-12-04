resource "aws_ecs_task_definition" "main" {
  family = local.global_name

  container_definitions = <<CONTAINERS
[
  {
    "name": "app",
    "image": "${var.image}",
    "cpu": 8,
    "memory": 128,
    "memoryReservation": 8,
    "essential": true,
    "portMappings": [
        {
            "containerPort": 80,
            "protocol": "tcp"
        }
    ],
    "environment": [
      {"name": "AWS_REGION", "value": "${var.region}"},
      {"name": "LOG_LEVEL", "value": "${var.env == "production" ? "info" : "debug"}"}
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${aws_cloudwatch_log_group.main.name}",
        "awslogs-region": "${var.region}",
        "awslogs-stream-prefix": "app"
      }
    }
  }
]
CONTAINERS
}

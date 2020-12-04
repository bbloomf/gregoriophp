resource "aws_ecs_service" "main" {
  name            = local.global_name
  cluster         = var.cluster
  task_definition = aws_ecs_task_definition.main.arn

  desired_count = var.autoscaling_range[0]

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  health_check_grace_period_seconds = 60

  ordered_placement_strategy {
    type  = "spread"
    field = "instanceId"
  }

  load_balancer {
    target_group_arn = module.target_group.arn
    container_name   = "app"
    container_port   = "80"
  }

  lifecycle {
    ignore_changes = [desired_count]
  }
}

# define the iam target group along with alb rules and dns entries
module "target_group" {
  source   = "git::https://gitlab.com/5stones/tf-modules//aws/lb/target-group?ref=v2.7.0"
  name     = local.global_name
  hostname = var.hostname
  alb      = var.alb
  zone     = var.zone
  path_patterns = [ "/${var.path}/*" ]
}

module "autoscaling" {
  source = "git::https://gitlab.com/5stones/tf-modules//aws/ecs/autoscaling?ref=v2.6.0"

  cluster = aws_ecs_service.main.cluster
  service = aws_ecs_service.main.name
  range   = var.autoscaling_range
}

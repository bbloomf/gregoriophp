locals {
  global_name = "${var.env}-${var.name}"
}

# define the log group
resource "aws_cloudwatch_log_group" "main" {
  name              = local.global_name
  retention_in_days = var.env == "production" ? 90 : 7
}

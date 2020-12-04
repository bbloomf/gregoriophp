provider "aws" {
  region = "us-east-2"
}

terraform {
  # configure terraform to store the state in an encrypted, versioned s3
  backend "s3" {
    bucket = "terraform-illuminare"
    key    = "staging/old-editor/app.tfstate"
    region = "us-east-2"
  }
}

locals {
  region = "us-east-2"
  env    = "staging"
}

module "ci" {
  source      = "git::https://gitlab.com/5stones/tf-modules//ci?ref=v2.6.0"
  docker_repo = "839465883730.dkr.ecr.us-east-2.amazonaws.com/illuminare/public-gregorio"
}

module "main" {
  source = "../modules/app"

  region  = local.region
  image   = module.ci.docker_image
  env     = local.env
  cluster = local.env
  alb     = local.env
  zone    = "staging.sourceandsummit.com"
}

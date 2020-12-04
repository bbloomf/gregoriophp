variable "region" {
}

variable "env" {
}

variable "cluster" {
}

variable "image" {
}

variable "alb" {
}

variable "zone" {
}

variable "name" {
  default = "old-editor"
}

variable "hostname" {
  default = "editor"
}

variable "path" {
  default = "old"
}

variable "autoscaling_range" {
  default = [1, 1]
}

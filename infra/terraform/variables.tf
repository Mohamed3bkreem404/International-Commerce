variable "instance_type" {
  description = "ec2 instance type"
  type        = string
  default     = "m7i-flex.large"
}

variable "availability_zone" {
  description = "availability zone for the subnet"
  type        = string
  default     = "eu-central-1a"
}

variable "vpc_cidr" {
  description = "vpc cidr block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "public subnet cidr block"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "private subnet cidr block"
  type        = string
  default     = "10.0.2.0/24"
}

variable "route_table_cidr" {
  description = "route table cidr block"
  type        = string
  default     = "0.0.0.0/0"
}

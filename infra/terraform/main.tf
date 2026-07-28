resource "aws_vpc" "ecommerce_vpc" {
  cidr_block = var.vpc_cidr
}


resource "aws_instance" "ecommerce_instance" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  tags = {
    name = "ecommerce-instance"
  }
}

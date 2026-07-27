resource "aws_instance" "ecommerce_instance" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  tags = {
    name = "ecommerce-instance"
  }
}

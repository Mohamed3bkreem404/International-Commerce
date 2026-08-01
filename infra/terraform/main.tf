resource "aws_vpc" "ecommerce_vpc" {
  cidr_block = var.vpc_cidr

  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "ecommerce-vpc"
  }
}


resource "aws_subnet" "public" {
  vpc_id = aws_vpc.ecommerce_vpc.id

  cidr_block = var.public_subnet_cidr

  availability_zone = var.availability_zone

  map_public_ip_on_launch = true

  tags = {
    Name = "ecommerce-public-subnet"
  }
}



resource "aws_subnet" "private" {
  vpc_id = aws_vpc.ecommerce_vpc.id

  cidr_block = var.private_subnet_cidr
}

resource "aws_internet_gateway" "ecommerce_igw" {
  vpc_id = aws_vpc.ecommerce_vpc.id
  tags = {
    Name = "ecommerce-igw"
  }
}


resource "aws_route_table" "public" {
  vpc_id = aws_vpc.ecommerce_vpc.id

  route {
    cidr_block = var.route_table_cidr
    gateway_id = aws_internet_gateway.ecommerce_igw.id
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}



resource "aws_security_group" "ecommerce_sg" {
  name        = "ecommerce-sg"
  description = "Allow HTTP , HTTPS , and SSH traffic"
  vpc_id      = aws_vpc.ecommerce_vpc.id

  ingress {
    description = "Allow HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"

    cidr_blocks = [var.route_table_cidr]
  }

  ingress {
    description = "Allow HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"

    cidr_blocks = [var.route_table_cidr]
  }

  ingress {
    description = "Allow SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"

    cidr_blocks = [var.route_table_cidr]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"

    cidr_blocks = [var.route_table_cidr]
  }

  tags = {
    Name = "ecommerce-sg"
  }
}




resource "aws_instance" "ecommerce_instance" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ecommerce_sg.id]
  key_name               = "devops-key"

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }
  tags = {
    name = "ecommerce-instance"
  }
}

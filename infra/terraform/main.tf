#VPC
resource "aws_vpc" "ecommerce_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "ecommerce-vpc"
  }
}

# Internet Gateway

resource "aws_internet_gateway" "ecommerce_igw" {
  vpc_id = aws_vpc.ecommerce_vpc.id

  tags = {
    Name = "ecommerce-igw"
  }
}

# Public subnet

resource "aws_subnet" "ecommerce_public_subnet" {
  vpc_id                  = aws_vpc.ecommerce_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "eu-central-1a"

  tags = {
    Name = "ecommerce-public-subnet"
  }
}

# Private subnet
resource "aws_subnet" "ecommerce_private_subnet" {
  vpc_id            = aws_vpc.ecommerce_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "eu-central-1a"

  tags = {
    Name = "ecommerce-private-subnet"
  }
}

resource "aws_eip" "ecommerce_nat" {
  depends_on = [aws_internet_gateway.ecommerce_igw]

  tags = {
    Name = "ecommerce-nat"
  }
}

# NAT gateway in public subnet
resource "aws_nat_gateway" "ecommerce_nat_gateway" {
  allocation_id = aws_eip.ecommerce_nat.id
  subnet_id     = aws_subnet.ecommerce_public_subnet.id

  tags = {
    Name = "ecommerce-nat-gateway"
  }
}

# Public Route Table
resource "aws_route_table" "ecommerce_public_rt" {
  vpc_id = aws_vpc.ecommerce_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ecommerce_igw.id
  }

  tags = {
    Name = "ecommerce-public-route-table"

  }
}

# Associate Route Table with Public Subnet
resource "aws_route_table_association" "ecommerce_public_rt_association" {
  subnet_id      = aws_subnet.ecommerce_public_subnet.id
  route_table_id = aws_route_table.ecommerce_public_rt.id
}

# Security Group
resource "aws_security_group" "ecommerce_sg" {
  name        = "ecommerce-security-group"
  description = "Allow HTTP, HTTPS and 8080"
  vpc_id      = aws_vpc.ecommerce_vpc.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Application Port"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ecommerce-security-group"
  }
}

resource "aws_instance" "ecommerce_instance" {
  ami           = "ami-0303e2e4a29f041a3"
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.ecommerce_public_subnet.id

  vpc_security_group_ids = [
    aws_security_group.ecommerce_sg.id
  ]

  tags = {
    Name = "ecommerce-instance"
  }
}

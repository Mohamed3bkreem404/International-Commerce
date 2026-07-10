#!/bin/bash

set -e

BASE_DIR="helm/ecommerce"

# Create directories
mkdir -p \
"$BASE_DIR/templates/api-gateway" \
"$BASE_DIR/templates/auth" \
"$BASE_DIR/templates/product" \
"$BASE_DIR/templates/cart" \
"$BASE_DIR/templates/order" \
"$BASE_DIR/templates/payment" \
"$BASE_DIR/templates/frontend" \
"$BASE_DIR/templates/redis" \
"$BASE_DIR/templates/monitoring" \
"$BASE_DIR/templates/ingress"

# Create root files
touch \
"$BASE_DIR/Chart.yaml" \
"$BASE_DIR/values.yaml" \
"$BASE_DIR/values-dev.yaml" \
"$BASE_DIR/values-prod.yaml" \
"$BASE_DIR/.helmignore"

# Create template files
touch \
"$BASE_DIR/templates/_helpers.tpl" \
"$BASE_DIR/templates/NOTES.txt" \
"$BASE_DIR/templates/namespace.yaml"

# API Gateway
touch \
"$BASE_DIR/templates/api-gateway/deployment.yaml" \
"$BASE_DIR/templates/api-gateway/service.yaml" \
"$BASE_DIR/templates/api-gateway/configmap.yaml"

# Auth
touch \
"$BASE_DIR/templates/auth/deployment.yaml" \
"$BASE_DIR/templates/auth/service.yaml" \
"$BASE_DIR/templates/auth/configmap.yaml"

# Product
touch \
"$BASE_DIR/templates/product/deployment.yaml" \
"$BASE_DIR/templates/product/service.yaml" \
"$BASE_DIR/templates/product/configmap.yaml"

# Cart
touch \
"$BASE_DIR/templates/cart/deployment.yaml" \
"$BASE_DIR/templates/cart/service.yaml" \
"$BASE_DIR/templates/cart/configmap.yaml"

# Order
touch \
"$BASE_DIR/templates/order/deployment.yaml" \
"$BASE_DIR/templates/order/service.yaml" \
"$BASE_DIR/templates/order/configmap.yaml"

# Payment
touch \
"$BASE_DIR/templates/payment/deployment.yaml" \
"$BASE_DIR/templates/payment/service.yaml" \
"$BASE_DIR/templates/payment/configmap.yaml"

# Frontend
touch \
"$BASE_DIR/templates/frontend/deployment.yaml" \
"$BASE_DIR/templates/frontend/service.yaml" \
"$BASE_DIR/templates/frontend/configmap.yaml"

# Redis
touch \
"$BASE_DIR/templates/redis/deployment.yaml" \
"$BASE_DIR/templates/redis/service.yaml" \
"$BASE_DIR/templates/redis/pvc.yaml"

# Monitoring
touch \
"$BASE_DIR/templates/monitoring/prometheus.yaml" \
"$BASE_DIR/templates/monitoring/prometheus-configmap.yaml" \
"$BASE_DIR/templates/monitoring/grafana.yaml" \
"$BASE_DIR/templates/monitoring/alertmanager.yaml"

# Ingress
touch \
"$BASE_DIR/templates/ingress/ingress.yaml"


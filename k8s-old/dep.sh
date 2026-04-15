#!/bin/bash

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

for deploymentName in api auth cart frontend order payment product
do
   kubectl apply -f "$BASE_DIR/$deploymentName.yaml"
done

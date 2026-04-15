#!/bin/bash

for service in user cart frontend order payment product  
do
   docker push ineutrono/ecm-$service-service:latest
done

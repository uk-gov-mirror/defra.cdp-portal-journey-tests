#!/bin/bash
echo Setting up Portal DynamoDb tables

source /etc/localstack/conf.d/defaults.env

aws --endpoint $LOCALSTACK_URL dynamodb create-table --region $AWS_REGION --table-name cdp-portal-frontend-session --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
aws --endpoint $LOCALSTACK_URL dynamodb update-time-to-live --region $AWS_REGION --table-name cdp-portal-frontend-session --time-to-live-specification "Enabled=true,AttributeName=expiresAt"

# aws --endpoint http://localhost:4566 dynamodb create-table --region eu-west-2 --table-name cdp-portal-frontend-session --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
# aws --endpoint http://localhost:4566 dynamodb update-time-to-live --region eu-west-2 --table-name cdp-portal-frontend-session --time-to-live-specification "Enabled=true,AttributeName=expiresAt"
# aws --endpoint http://localhost:4566 dynamodb list-tables --region eu-west-2

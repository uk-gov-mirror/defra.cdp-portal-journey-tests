#!/bin/sh

# Create the stack
aws cloudformation create-stack \
  --stack-name bootstrap-stack \
  --template-body file://resources.yaml \
  --debug

aws s3 cp --recursive ./assets/cdp-documentation/ s3://cdp-documentation
aws s3 cp --recursive ./assets/cdp-migrations/ s3://cdp-migrations
aws s3 cp --recursive ./assets/cdp-infra-dev-imports/ s3://cdp-infra-dev-imports

echo READY > /tmp/READY

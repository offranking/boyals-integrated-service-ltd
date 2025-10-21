#!/bin/bash

# Explicitly set the bucket name
BUCKET="boyal-main-website"

echo " Setting up S3 website: $BUCKET"

# Create bucket
echo " Creating S3 bucket..."
aws s3 mb s3://$BUCKET --region us-east-1

# Build and deploy
echo " Building website..."
npm run build
echo " Uploading files..."
aws s3 sync ./dist s3://$BUCKET --delete

# Configure website
echo " Configuring website hosting..."
aws s3 website s3://$BUCKET --index-document index.html --error-document index.html

# Set permissions
echo "🔓 Setting permissions..."
aws s3api put-public-access-block \
    --bucket $BUCKET \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

aws s3api put-bucket-policy --bucket $BUCKET --policy '{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::'$BUCKET'/*"
    }]
}'

# Test
echo " Testing..."
curl -I http://$BUCKET.s3-website-us-east-1.amazonaws.com

echo ""
echo " WEBSITE SETUP COMPLETE!"
echo " DNS SETUP:"
echo "1. Go to Route53 in your DOMAIN ACCOUNT"
echo "2. Create CNAME record:"
echo "   - Name: www"
echo "   - Type: CNAME" 
echo "   - Value: boyal-main-website.s3-website-us-east-1.amazonaws.com"
echo "   - TTL: 300"
echo "   - Routing: Simple"

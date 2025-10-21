#!/bin/bash

OLD_BUCKET="www.boyalintegratedservice.com"
NEW_BUCKET="www-boyalintegratedservice-com"

echo " Fixing S3 bucket naming issue..."

# Create new bucket without dots
echo "🪣 Creating new bucket: $NEW_BUCKET"
aws s3 mb s3://$NEW_BUCKET --region us-east-1

# Configure website hosting
echo " Configuring website hosting..."
aws s3 website s3://$NEW_BUCKET --index-document index.html --error-document index.html

# Set public access
echo " Setting public access..."
aws s3api put-public-access-block \
    --bucket $NEW_BUCKET \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Set bucket policy
echo "Setting bucket policy..."
aws s3api put-bucket-policy --bucket $NEW_BUCKET --policy '{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::'$NEW_BUCKET'/*"
    }]
}'

# Build and deploy fresh files
echo " Building and deploying..."
npm run build
aws s3 sync ./dist s3://$NEW_BUCKET --delete

echo ""
echo " Fixed S3 Website:"
echo "URL: http://$NEW_BUCKET.s3-website-us-east-1.amazonaws.com"
echo ""
echo " For DNS setup use:"
echo "S3 Endpoint: $NEW_BUCKET.s3-website-us-east-1.amazonaws.com"
echo "Hosted Zone ID: Z3AQBSTGFYJSTF"
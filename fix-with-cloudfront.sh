#!/bin/bash

# Your existing S3 bucket with dots
BUCKET_NAME="www.boyalintegratedservice.com"
DOMAIN="www.boyalintegratedservice.com"

echo "Setting up CloudFront for $DOMAIN..."

# Step 1: Ensure S3 is properly configured
echo "🔧 Configuring S3 bucket..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy '{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow", 
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
    }]
}'

# Step 2: Build and deploy to S3
echo " Building and deploying to S3..."
npm run build
aws s3 sync ./dist s3://$BUCKET_NAME --delete

# Step 3: Create CloudFront distribution
echo " Creating CloudFront distribution..."

# Create CloudFront config file
cat > cloudfront-config.json << EOF
{
    "CallerReference": "boyal-$(date +%s)",
    "Comment": "Boyal Integrated Service - $DOMAIN",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3-website.us-east-1.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only",
                    "OriginReadTimeout": 30,
                    "OriginKeepaliveTimeout": 5
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": { "Forward": "none" }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true
    },
    "Enabled": true,
    "PriceClass": "PriceClass_All",
    "Aliases": {
        "Quantity": 1,
        "Items": ["$DOMAIN"]
    }
}
EOF

# Create CloudFront distribution
echo " Creating CloudFront distribution (this takes a few minutes)..."
CF_DOMAIN=$(aws cloudfront create-distribution --distribution-config file://cloudfront-config.json --query 'Distribution.DomainName' --output text)
CF_ID=$(aws cloudfront create-distribution --distribution-config file://cloudfront-config.json --query 'Distribution.Id' --output text)

echo " CloudFront distribution created!"
echo " CloudFront Domain: $CF_DOMAIN"
echo "CloudFront ID: $CF_ID"

# Clean up
rm cloudfront-config.json

echo ""
echo " Next Steps:"
echo "1. Wait 10-15 minutes for CloudFront deployment"
echo "2. Then set up DNS in your domain account to point to: $CF_DOMAIN"
echo "3. Your website will be available at: https://$DOMAIN"
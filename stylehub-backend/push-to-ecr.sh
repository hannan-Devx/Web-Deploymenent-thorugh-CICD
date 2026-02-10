#!/bin/bash

# ECR Push Script for StyleHub API
# Usage: ./push-to-ecr.sh

set -e

# Configuration
AWS_REGION="ap-south-1"
AWS_ACCOUNT_ID="026674665070"  # Replace with your AWS account ID
ECR_REPO="stylehub-api"
IMAGE_TAG="v1"

# Full ECR URI
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"

echo "========================================="
echo "🐳 Pushing Docker Image to AWS ECR"
echo "========================================="
echo ""

# Step 1: Login to ECR
echo "Step 1: Authenticating with ECR..."
aws ecr get-login-password --region ${AWS_REGION} | \
  docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

echo "✅ Authentication successful"
echo ""

# Step 2: Build Docker image
echo "Step 2: Building Docker image..."
docker build -t ${ECR_REPO}:${IMAGE_TAG} .

echo "✅ Image built successfully"
echo ""

# Step 3: Tag image for ECR
echo "Step 3: Tagging image for ECR..."
docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_URI}:${IMAGE_TAG}
docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_URI}:latest

echo "✅ Image tagged"
echo ""

# Step 4: Push to ECR
echo "Step 4: Pushing image to ECR..."
docker push ${ECR_URI}:${IMAGE_TAG}
docker push ${ECR_URI}:latest

echo ""
echo "========================================="
echo "✅ Successfully pushed to ECR!"
echo "========================================="
echo ""
echo "Image URIs:"
echo "  - ${ECR_URI}:${IMAGE_TAG}"
echo "  - ${ECR_URI}:latest"
echo ""
echo "Next: Deploy to ECS (Phase 6)"
echo "========================================="
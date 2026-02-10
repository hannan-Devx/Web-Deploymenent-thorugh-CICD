# StyleHub Backend API

Express.js backend API for StyleHub e-commerce platform, containerized with Docker and deployed on AWS ECS.

## 🚀 Tech Stack

- **Runtime:** Node.js 20.x
- **Framework:** Express.js
- **Database:** AWS DynamoDB
- **Container:** Docker
- **Registry:** AWS ECR
- **Deployment:** AWS ECS (Fargate)

## 📋 Prerequisites

- Node.js 20+ installed
- Docker Desktop installed
- AWS CLI configured
- AWS Account with IAM permissions

## 🛠️ Local Setup

### 1. Install Dependencies

```bash
cd stylehub-backend
npm install
```

### 2. Configure Environment

```bash
# Copy example file
cp .env.example .env

# Edit .env with your AWS credentials
nano .env
```

### 3. Run Locally

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 4. Test API

```bash
# Health check
curl http://localhost:3000/health

# Get all products
curl http://localhost:3000/products

# Get products by category
curl http://localhost:3000/products?category=jeans

# Get single product
curl http://localhost:3000/products?productId=jeans-1
```

## 🐳 Docker

### Build Image

```bash
docker build -t stylehub-api:v1 .
```

### Run Container Locally

```bash
docker run -d \
  -p 3000:3000 \
  -e AWS_REGION=ap-south-1 \
  -e AWS_ACCESS_KEY_ID=your_key \
  -e AWS_SECRET_ACCESS_KEY=your_secret \
  -e TABLE_NAME=StyleHub-Products \
  --name stylehub-api \
  stylehub-api:v1
```

### View Logs

```bash
docker logs -f stylehub-api
```

### Stop Container

```bash
docker stop stylehub-api
docker rm stylehub-api
```

## ☁️ AWS ECR Deployment

### 1. Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name stylehub-api \
  --region ap-south-1
```

### 2. Authenticate Docker to ECR

```bash
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin \
  ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com
```

### 3. Push Image

```bash
# Using script
chmod +x push-to-ecr.sh
./push-to-ecr.sh

# Or manually
docker tag stylehub-api:v1 ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/stylehub-api:v1
docker push ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/stylehub-api:v1
```

## 📡 API Endpoints

### Base URL
- Local: `http://localhost:3000`
- Production: `https://api.stylehub.com` (via ECS + ALB)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| GET | `/products` | Get all products |
| GET | `/products?category=jeans` | Filter by category |
| GET | `/products?productId=jeans-1` | Get single product |
| GET | `/products/:id` | Get product by ID |

### Response Format

```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "productId": "jeans-1",
      "name": "Slim Fit Denim",
      "price": 4500,
      "category": "jeans",
      "inStock": true,
      ...
    }
  ]
}
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AWS_REGION` | AWS region | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes |
| `TABLE_NAME` | DynamoDB table name | Yes |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment | No (default: development) |

## 📊 Project Structure

```
stylehub-backend/
├── server.js           # Main Express server
├── package.json        # Dependencies
├── Dockerfile          # Docker configuration
├── .dockerignore       # Docker ignore rules
├── .env.example        # Environment template
├── push-to-ecr.sh      # ECR push script
└── README.md           # This file
```

## 🧪 Testing

```bash
# Run all endpoints test
npm test
```

## 📝 Notes

- Never commit `.env` file
- Use `.env.example` as template
- AWS credentials should have DynamoDB read permissions
- Docker image size: ~150MB (optimized with Alpine)

## 🔗 Related

- Frontend: `../` (root of repository)
- DynamoDB Table: `StyleHub-Products`
- ECR Repository: `stylehub-api`

## 📄 License

MIT
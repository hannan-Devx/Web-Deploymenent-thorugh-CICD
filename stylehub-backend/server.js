// Express API Server - Fixed Credentials
const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Validate environment variables
const requiredEnvVars = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'TABLE_NAME'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars);
    console.error('Please check your .env file');
    process.exit(1);
}

// Configure AWS with explicit credentials
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

console.log('✅ AWS Configuration:');
console.log('  Region:', process.env.AWS_REGION);
console.log('  Access Key:', process.env.AWS_ACCESS_KEY_ID.substring(0, 10) + '...');
console.log('  Table:', process.env.TABLE_NAME);

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'StyleHub API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        config: {
            region: process.env.AWS_REGION,
            table: TABLE_NAME
        }
    });
});

// Health check (for load balancer)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Test DynamoDB connection
app.get('/test-db', async (req, res) => {
    try {
        console.log('Testing DynamoDB connection...');
        
        const params = {
            TableName: TABLE_NAME,
            Limit: 1
        };
        
        const result = await dynamodb.scan(params).promise();
        
        res.json({
            success: true,
            message: 'DynamoDB connection successful',
            itemCount: result.Items ? result.Items.length : 0,
            table: TABLE_NAME
        });
        
    } catch (error) {
        console.error('DynamoDB test error:', error);
        res.status(500).json({
            success: false,
            message: 'DynamoDB connection failed',
            error: error.message,
            code: error.code
        });
    }
});

// Get all products or filter by category
app.get('/products', async (req, res) => {
    try {
        const { category, productId } = req.query;
        
        console.log('GET /products - Query:', { category, productId });
        
        // Get single product
        if (productId) {
            const params = {
                TableName: TABLE_NAME,
                Key: { productId }
            };
            
            console.log('Fetching product:', productId);
            const result = await dynamodb.get(params).promise();
            
            if (!result.Item) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                    count: 0,
                    data: []
                });
            }
            
            return res.json({
                success: true,
                count: 1,
                data: [result.Item]
            });
        }
        
        // Get all or filter by category
        const scanParams = { TableName: TABLE_NAME };
        
        if (category) {
            scanParams.FilterExpression = 'category = :category';
            scanParams.ExpressionAttributeValues = { ':category': category };
            console.log('Filtering by category:', category);
        } else {
            console.log('Fetching all products');
        }
        
        const result = await dynamodb.scan(scanParams).promise();
        
        console.log('Products found:', result.Items ? result.Items.length : 0);
        
        res.json({
            success: true,
            count: result.Items ? result.Items.length : 0,
            data: result.Items || []
        });
        
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
            code: error.code,
            count: 0,
            data: []
        });
    }
});

// Get product by ID (alternative route)
app.get('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        
        const params = {
            TableName: TABLE_NAME,
            Key: { productId }
        };
        
        const result = await dynamodb.get(params).promise();
        
        if (!result.Item) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            data: result.Item
        });
        
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 StyleHub API Server Started');
    console.log('========================================');
    console.log(`Port: ${PORT}`);
    console.log(`Region: ${process.env.AWS_REGION}`);
    console.log(`Table: ${TABLE_NAME}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`Test DB: http://localhost:${PORT}/test-db`);
    console.log(`Products: http://localhost:${PORT}/products`);
    console.log('========================================');
});
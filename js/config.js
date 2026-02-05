// API Configuration
// Replace YOUR_API_ID with actual API Gateway ID
const API_CONFIG = {
    baseUrl: 'https://6kt98ddutd.execute-api.ap-south-1.amazonaws.com/prodhttps://6kt98ddutd.execute-api.ap-south-1.amazonaws.com/prod/products',
    endpoints: {
        products: '/products',
        orders: '/orders'  // For future use
    }
};

// Get API URL from console:
// AWS Console → API Gateway → StyleHub-API → Stages → prod → Invoke URL
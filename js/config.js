// API Configuration for ap-south-1 (Mumbai)
const API_CONFIG = {
    baseUrl: 'https://us70apeqe7.execute-api.ap-south-1.amazonaws.com/prod',
    endpoints: {
        products: '/products',
        orders: '/orders'
    }
};

// Debug logging
console.log('🔧 API Config Loaded:');
console.log('Base URL:', API_CONFIG.baseUrl);
console.log('Products endpoint:', API_CONFIG.baseUrl + API_CONFIG.endpoints.products);
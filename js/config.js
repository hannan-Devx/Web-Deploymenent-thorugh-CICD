// API Configuration - EC2 Deployment
const API_CONFIG = {
    // EC2 Public IP (Replace with your actual EC2 public IP)
    baseUrl: 'http://43.205.125.247',
   
    
    endpoints: {
        products: '/products',
        orders: '/orders'
    }
};

console.log('🔧 API Config:');
console.log('Backend:', API_CONFIG.baseUrl);
console.log('Frontend:', 'CloudFront (HTTPS)');

// Debug logging
console.log('🔧 API Config Loaded (EC2 Deployment):');
console.log('Base URL:', API_CONFIG.baseUrl);
console.log('Products endpoint:', API_CONFIG.baseUrl + API_CONFIG.endpoints.products);

// Test API on page load
console.log('Testing EC2 API connection...');
fetch(API_CONFIG.baseUrl + API_CONFIG.endpoints.products + '?category=jeans')
    .then(response => response.json())
    .then(data => {
        console.log('✅ EC2 API Test Successful!');
        console.log('Products found:', data.count);
        console.log('Powered by: Docker on EC2');
    })
    .catch(error => {
        console.error('❌ EC2 API Test Failed:', error);
        console.log('Make sure EC2 security group allows HTTP (port 80) from 0.0.0.0/0');
    });
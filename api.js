// API Service - Handles all backend communication

class APIService {
    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
    }
    
    // Generic API call method
    async makeRequest(endpoint, method = 'GET', body = null) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        try {
            console.log(`Making ${method} request to: ${url}`);
            const response = await fetch(url, options);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // Get all products
    async getAllProducts() {
        return await this.makeRequest(API_CONFIG.endpoints.products);
    }
    
    // Get products by category
    async getProductsByCategory(category) {
        return await this.makeRequest(
            `${API_CONFIG.endpoints.products}?category=${category}`
        );
    }
    
    // Get single product by ID
    async getProductById(productId) {
        return await this.makeRequest(
            `${API_CONFIG.endpoints.products}?productId=${productId}`
        );
    }
}

// Create global instance
const apiService = new APIService();
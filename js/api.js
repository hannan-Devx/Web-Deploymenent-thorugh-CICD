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
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'API request failed');
            }
            
            // Return structured response
            return {
                success: result.success || true,
                message: result.message || '',
                data: result.data || result,
                count: result.count || (Array.isArray(result.data) ? result.data.length : 0)
            };
            
        } catch (error) {
            console.error('API Error:', error);
            return {
                success: false,
                message: error.message,
                data: []
            };
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
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    console.log('🔍 API Service - Token from localStorage:', token ? 'Found' : 'Not found');
    console.log('🔍 API Service - Token value:', token ? token.substring(0, 20) + '...' : 'None');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
  }

  // Auth endpoints
  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await this.handleResponse(response);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await this.handleResponse(response);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async updatePreferences(preferences) {
    const response = await fetch(`${this.baseURL}/auth/preferences`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ preferences })
    });
    return this.handleResponse(response);
  }

  // Housing endpoints
  async getHousingOptions(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${this.baseURL}/housing?${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getHousingOption(id) {
    const response = await fetch(`${this.baseURL}/housing/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async likeHousingOption(id) {
    const response = await fetch(`${this.baseURL}/housing/${id}/like`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async dislikeHousingOption(id) {
    const response = await fetch(`${this.baseURL}/housing/${id}/dislike`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async addReview(housingId, reviewData) {
    const response = await fetch(`${this.baseURL}/housing/${housingId}/review`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });
    return this.handleResponse(response);
  }

  async addTag(housingId, tagData) {
    const response = await fetch(`${this.baseURL}/housing/${housingId}/tag`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(tagData)
    });
    return this.handleResponse(response);
  }

  // Collection endpoints
  async getCollections() {
    const response = await fetch(`${this.baseURL}/collections`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getCollection(id) {
    const response = await fetch(`${this.baseURL}/collections/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createCollection(collectionData) {
    console.log('🚀 API Service - Creating collection:', collectionData);
    const headers = this.getAuthHeaders();
    console.log('🚀 API Service - Headers:', headers);
    
    const response = await fetch(`${this.baseURL}/collections`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(collectionData)
    });
    
    console.log('🚀 API Service - Response status:', response.status);
    console.log('🚀 API Service - Response ok:', response.ok);
    
    return this.handleResponse(response);
  }

  async updateCollection(id, updates) {
    const response = await fetch(`${this.baseURL}/collections/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return this.handleResponse(response);
  }

  async deleteCollection(id) {
    const response = await fetch(`${this.baseURL}/collections/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async addHousingToCollection(collectionId, housingId) {
    const response = await fetch(`${this.baseURL}/collections/${collectionId}/housing/${housingId}`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async removeHousingFromCollection(collectionId, housingId) {
    const response = await fetch(`${this.baseURL}/collections/${collectionId}/housing/${housingId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async shareCollection(collectionId, username, canEdit = false) {
    const response = await fetch(`${this.baseURL}/collections/${collectionId}/share`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ username, canEdit })
    });
    return this.handleResponse(response);
  }

  // Search endpoints (legacy - keeping for compatibility)

  async getNearbyHousing(lat, lng, maxDistance = 5) {
    const response = await fetch(`${this.baseURL}/search/nearby?lat=${lat}&lng=${lng}&maxDistance=${maxDistance}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getRecommendations(limit = 10) {
    const response = await fetch(`${this.baseURL}/search/recommendations?limit=${limit}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // User endpoints
  async searchUsers(query, limit = 10) {
    const response = await fetch(`${this.baseURL}/users/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getUserProfile(username) {
    const response = await fetch(`${this.baseURL}/users/${username}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async updateProfile(profileData) {
    const response = await fetch(`${this.baseURL}/users/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return this.handleResponse(response);
  }

  async getUserStats() {
    const response = await fetch(`${this.baseURL}/users/stats`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Intelligent Search
  async intelligentSearch(query, voiceInput = false) {
    const response = await fetch(`${this.baseURL}/search/intelligent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, voiceInput })
    });
    
    return await this.handleResponse(response);
  }

  // Voice Search
  async voiceSearch(transcript, confidence = 0.8) {
    const response = await fetch(`${this.baseURL}/search/voice`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ transcript, confidence })
    });
    return this.handleResponse(response);
  }

  // Get Search Suggestions
  async getSearchSuggestions(query) {
    const response = await fetch(`${this.baseURL}/search/suggestions?q=${encodeURIComponent(query)}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
  }
}

export default new ApiService();

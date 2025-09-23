import { User, BloodRequest } from '../types';

// This is the base URL for your future Django backend.
const API_BASE_URL = '/api';

/**
 * Creates the authorization headers for authenticated requests.
 * It retrieves the auth token from localStorage.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    // Django REST Framework's JWT auth often uses 'Bearer'
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// A helper to handle API responses and errors
const handleResponse = async (response: Response) => {
    if (response.ok) {
        // Handle cases with no content
        if (response.status === 204) {
            return null;
        }
        return response.json();
    }
    
    // Try to parse a JSON error response from the backend
    try {
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.message || 'An unknown API error occurred';
        throw new Error(errorMessage);
    } catch (e) {
        // If parsing fails or it's not a JSON error, use the status text
        throw new Error(response.statusText || 'An unknown network error occurred');
    }
};

// =================================
// AUTHENTICATION
// =================================

const login = async (email: string): Promise<{ token: string; user: User }> => {
  // NOTE: A real login would typically require a password.
  // This is simplified to match the current UI.
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }), // Adjust payload as needed for your backend
  });
  const data = await handleResponse(response);
  if (data.token) {
    localStorage.setItem('authToken', data.token);
  }
  return data;
};

const register = async (userData: Omit<User, 'id' | 'donations'>): Promise<{ token: string; user: User }> => {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await handleResponse(response);
  if (data.token) {
    localStorage.setItem('authToken', data.token);
  }
  return data;
};

const logout = (): void => {
    localStorage.removeItem('authToken');
    // Optional: Send a request to the backend to invalidate the token
    // fetch(`${API_BASE_URL}/auth/logout/`, { method: 'POST', headers: getAuthHeaders() });
};

// =================================
// CURRENT USER
// =================================
const getCurrentUser = async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
}

// =================================
// BLOOD REQUESTS
// =================================

const getRequests = async (): Promise<BloodRequest[]> => {
  const response = await fetch(`${API_BASE_URL}/requests/`);
  return handleResponse(response);
};

const getRequestById = async (id: string): Promise<BloodRequest | undefined> => {
  const response = await fetch(`${API_BASE_URL}/requests/${id}/`);
  if (response.status === 404) return undefined;
  return handleResponse(response);
};

const createRequest = async (requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>): Promise<BloodRequest> => {
  const response = await fetch(`${API_BASE_URL}/requests/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(requestData)
  });
  return handleResponse(response);
};

// =================================
// USERS
// =================================

const getUserById = async (id: string): Promise<User | undefined> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}/`);
  if (response.status === 404) return undefined;
  return handleResponse(response);
};

// =================================
// MATCHING
// =================================

const findMatches = async (requestId: string): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/requests/${requestId}/matches/`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};


export const apiService = {
  login,
  register,
  logout,
  getCurrentUser,
  getRequests,
  getRequestById,
  createRequest,
  getUserById,
  findMatches,
};

import { User, BloodRequest } from '../types';
import { api as mockApi } from './mockApi';

// This is the base URL for your future Django backend.
// It can be replaced with an environment variable.
const API_BASE_URL = '/api';

/**
 * In a real application, you would replace the calls to `mockApi`
 * with `fetch` calls to your backend endpoints.
 * Example headers for authenticated requests:
 * const getAuthHeaders = () => ({
 *   'Content-Type': 'application/json',
 *   'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
 * });
 */

// =================================
// AUTHENTICATION
// =================================

const login = async (email: string): Promise<User | null> => {
  // REAL IMPLEMENTATION EXAMPLE:
  // const response = await fetch(`${API_BASE_URL}/auth/login/`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password }), // Django might need email/password
  // });
  // if (!response.ok) throw new Error('Login failed');
  // const { token, user } = await response.json();
  // localStorage.setItem('authToken', token);
  // return user;

  // For now, we use the mock API
  return mockApi.loginUser(email);
};

const register = async (userData: Omit<User, 'id' | 'donations'>): Promise<User> => {
  // REAL IMPLEMENTATION EXAMPLE:
  // const response = await fetch(`${API_BASE_URL}/auth/register/`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(userData),
  // });
  // if (!response.ok) {
  //   const errorData = await response.json();
  //   throw new Error(errorData.message || 'Registration failed');
  // }
  // return response.json();
  
  return mockApi.registerUser(userData);
};

// =================================
// BLOOD REQUESTS
// =================================

const getRequests = async (): Promise<BloodRequest[]> => {
  // REAL: return fetch(`${API_BASE_URL}/requests/`).then(res => res.json());
  return mockApi.getRequests();
};

const getRequestById = async (id: string): Promise<BloodRequest | undefined> => {
  // REAL: return fetch(`${API_BASE_URL}/requests/${id}/`).then(res => res.json());
  return mockApi.getRequestById(id);
};

const createRequest = async (requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>): Promise<BloodRequest> => {
  // REAL:
  // const response = await fetch(`${API_BASE_URL}/requests/`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(requestData)
  // });
  // if (!response.ok) throw new Error('Failed to create request');
  // return response.json();
  return mockApi.createRequest(requestData);
};

// =================================
// USERS
// =================================

const getUserById = async (id: string): Promise<User | undefined> => {
  // REAL: return fetch(`${API_BASE_URL}/users/${id}/`).then(res => res.json());
  return mockApi.getUserById(id);
};

// =================================
// MATCHING
// =================================

const findMatches = async (requestId: string): Promise<User[]> => {
  // In a real backend, this logic would be handled by the server.
  // REAL: return fetch(`${API_BASE_URL}/requests/${requestId}/matches/`).then(res => res.json());

  // For now, we simulate this by fetching the request and then finding matches.
  const request = await mockApi.getRequestById(requestId);
  if (!request) return [];
  return mockApi.findMatches(request);
};


export const apiService = {
  login,
  register,
  getRequests,
  getRequestById,
  createRequest,
  getUserById,
  findMatches,
};

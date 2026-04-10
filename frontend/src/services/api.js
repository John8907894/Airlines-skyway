const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Auth endpoints
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // Flight endpoints
  getFlights: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/flights?${queryString}`);
    return response.json();
  },

  getFlight: async (id) => {
    const response = await fetch(`${API_BASE_URL}/flights/${id}`);
    return response.json();
  },

  // Booking endpoints (Protected)
  createBooking: async (bookingData, token) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(bookingData)
    });
    return response.json();
  },

  getMyBookings: async (token) => {
    const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
      headers: {
        'x-auth-token': token
      }
    });
    return response.json();
  },

  // Hotel endpoints
  getHotels: async () => {
    const response = await fetch(`${API_BASE_URL}/hotels`);
    return response.json();
  },

  getHotel: async (id) => {
    const response = await fetch(`${API_BASE_URL}/hotels/${id}`);
    return response.json();
  },

  // Admin endpoints
  getAdminStats: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { 'x-auth-token': token }
    });
    return response.json();
  },

  getAllUsers: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 'x-auth-token': token }
    });
    return response.json();
  },

  updateUser: async (id, userData, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  deleteUser: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token }
    });
    return response.json();
  },

  createUser: async (userData, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  }
};

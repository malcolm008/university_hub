const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Auth endpoints
  auth: {
    register: (data) => fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

    login: (data) => fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

    getMe: (token) => fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(res => res.json()),

    logout: (token) => fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(res => res.json()),
  },

  // Registration endpoints
  registrations: {
    create: (data) => fetch(`${API_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

    getAll: (token, params = '') => fetch(`${API_URL}/registrations${params}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(res => res.json()),

    getByAmbassador: (token, slug) => fetch(`${API_URL}/registrations/ambassador/${slug}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(res => res.json()),

    update: (token, id, data) => fetch(`${API_URL}/registrations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then(res => res.json()),
  },

  // Proof endpoints
  proofs: {
    submit: (token, formData) => fetch(`${API_URL}/proofs`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    }).then(res => res.json()),

    validate: (token, registrationId) => fetch(`${API_URL}/proofs/validate/${registrationId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(res => res.json()),
  },

  // Gallery endpoints
  gallery: {
    getCategories: () => fetch(`${API_URL}/gallery/categories`).then(res => res.json()),
    getImages: (categoryId) => fetch(`${API_URL}/gallery/images${categoryId ? `?categoryId=${categoryId}` : ''}`).then(res => res.json()),
    createCategory: (token, data) => fetch(`${API_URL}/gallery/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then(res => res.json()),
    uploadImage: (token, formData) => fetch(`${API_URL}/gallery/images`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    }).then(res => res.json()),
    deleteImage: (token, id) => fetch(`${API_URL}/gallery/images/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(res => res.json()),
    deleteCategory: (token, id) => fetch(`${API_URL}/gallery/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(res => res.json()),
  },

  // ✅ Ambassador endpoints - ADD THIS
  ambassadors: {
    getAll: (token, includeInactive = false) => {
      const url = includeInactive 
        ? `${API_URL}/ambassadors?includeInactive=true` 
        : `${API_URL}/ambassadors`;
      return fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(res => res.json());
    },

    getBySlug: (slug) => fetch(`${API_URL}/ambassadors/slug/${slug}`).then(res => res.json()),

    getStats: (slug) => fetch(`${API_URL}/ambassadors/slug/${slug}/stats`).then(res => res.json()),

    create: (token, data) => fetch(`${API_URL}/ambassadors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then(res => res.json()),

    update: (token, id, data) => fetch(`${API_URL}/ambassadors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then(res => res.json()),

    delete: (token, id) => fetch(`${API_URL}/ambassadors/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(res => res.json()),

    toggleStatus: (token, id) => fetch(`${API_URL}/ambassadors/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(res => res.json()),
  },
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    return {
      success: false,
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
    };
  } else if (error.request) {
    return {
      success: false,
      message: 'No response from server. Please check your connection.',
    };
  } else {
    return {
      success: false,
      message: error.message || 'An error occurred',
    };
  }
};

export default api;
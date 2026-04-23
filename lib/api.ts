const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

async function fetchAPI<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || 'An error occurred',
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      error: error.message || 'Network error',
      status: 500,
    };
  }
}

// Auth APIs
export const authAPI = {
  signup: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    phone?: string;
    organizationCode?: string;
  }) => {
    return fetchAPI('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// Conversation APIs
export const conversationAPI = {
  getAll: async () => {
    return fetchAPI('/api/conversations');
  },

  getById: async (id: string) => {
    return fetchAPI(`/api/conversations/${id}`);
  },

  create: async (data: { message: string; category?: string }) => {
    return fetchAPI('/api/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  addMessage: async (id: string, message: string, sender: 'user' | 'bot' = 'user') => {
    return fetchAPI(`/api/conversations/${id}`, {
      method: 'POST',
      body: JSON.stringify({ message, sender }),
    });
  },

  updateStatus: async (id: string, status: string, priority?: string) => {
    return fetchAPI(`/api/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, priority }),
    });
  },
};

// Report APIs
export const reportAPI = {
  getAll: async () => {
    return fetchAPI('/api/reports');
  },

  create: async (data: {
    title: string;
    description: string;
    category: string;
    severity?: string;
    location?: {
      latitude: number;
      longitude: number;
      address: string;
    };
  }) => {
    return fetchAPI('/api/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (id: string, status: string, severity?: string) => {
    return fetchAPI(`/api/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, severity }),
    });
  },

  delete: async (id: string) => {
    return fetchAPI(`/api/reports/${id}`, {
      method: 'DELETE',
    });
  },
};

// Stats API
export const statsAPI = {
  get: async () => {
    return fetchAPI('/api/stats');
  },
};

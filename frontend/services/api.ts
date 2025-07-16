const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// Types for API responses
interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: string[];
}

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: number[];
  };
  type: string;
  salary: {
    type: string;
    min: number;
    max: number;
    currency: string;
    isNegotiable: boolean;
  };
  requirements: {
    experience: string;
    skills: string[];
    education: string;
    languages?: string[];
  };
  employer: {
    id: string;
    name: string;
    companyName?: string;
    avatar?: string;
    rating: { average: number };
    isVerified: boolean;
  };
  status: string;
  priority: string;
  isUrgent: boolean;
  views: number;
  currentApplications: number;
  createdAt: string;
  updatedAt: string;
  formattedSalary: string;
  locationString: string;
  daysSincePosted: number;
}

interface Application {
  id: string;
  job: Job;
  applicant: any;
  employer: any;
  status: string;
  coverLetter?: string;
  proposedSalary?: number;
  availability?: string;
  appliedAt: string;
  viewedByEmployer: boolean;
  statusHistory: any[];
  daysSinceApplied: number;
}

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'worker' | 'employer';
  avatar?: string;
  location?: any;
  isVerified: boolean;
  skills?: string[];
  experience?: string;
  rating?: { average: number; count: number };
  companyName?: string;
  bio?: string;
}

/**
 * A helper function to perform fetch requests with default headers.
 * It will also handle token management for authenticated requests.
 */
class ApiService {
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kaamsathi-token');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication endpoints
  auth = {
    sendOTP: async (phone: string): Promise<ApiResponse> => {
      return this.request('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
    },

    verifyOTP: async (phone: string, otp: string, role: string = 'worker', name?: string): Promise<ApiResponse<{ user: User; token: string }>> => {
      return this.request('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp, role, name }),
      });
    },

    getMe: async (): Promise<ApiResponse<{ user: User }>> => {
      return this.request('/auth/me');
    },

    logout: async (): Promise<ApiResponse> => {
      return this.request('/auth/logout', { method: 'POST' });
    },

    refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
      return this.request('/auth/refresh-token', { method: 'POST' });
    },

    changePhone: async (newPhone: string, otp: string): Promise<ApiResponse> => {
      return this.request('/auth/change-phone', {
        method: 'POST',
        body: JSON.stringify({ newPhone, otp }),
      });
    },
  };

  // Jobs endpoints
  jobs = {
    getAll: async (params: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      city?: string;
      state?: string;
      type?: string;
      salaryMin?: number;
      salaryMax?: number;
      experience?: string;
      skills?: string;
      sortBy?: string;
      sortOrder?: string;
    } = {}): Promise<ApiResponse<{ jobs: Job[]; pagination: any }>> => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      const queryString = queryParams.toString();
      return this.request(`/jobs${queryString ? `?${queryString}` : ''}`);
    },

    getById: async (id: string): Promise<ApiResponse<{ job: Job; hasApplied: boolean }>> => {
      return this.request(`/jobs/${id}`);
    },

    create: async (jobData: any): Promise<ApiResponse<{ job: Job }>> => {
      return this.request('/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData),
      });
    },

    update: async (id: string, jobData: any): Promise<ApiResponse<{ job: Job }>> => {
      return this.request(`/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(jobData),
      });
    },

    delete: async (id: string): Promise<ApiResponse> => {
      return this.request(`/jobs/${id}`, { method: 'DELETE' });
    },

    getMyJobs: async (params: { page?: number; limit?: number; status?: string } = {}): Promise<ApiResponse<{ jobs: Job[]; pagination: any }>> => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      const queryString = queryParams.toString();
      return this.request(`/jobs/employer/my-jobs${queryString ? `?${queryString}` : ''}`);
    },

    getStats: async (): Promise<ApiResponse> => {
      return this.request('/jobs/employer/stats');
    },

    search: async (query: string, filters: any = {}): Promise<ApiResponse<{ jobs: Job[]; pagination: any }>> => {
      const queryParams = new URLSearchParams({ q: query });
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      return this.request(`/jobs/search?${queryParams.toString()}`);
    },

    getRecommendations: async (): Promise<ApiResponse<{ jobs: Job[] }>> => {
      return this.request('/jobs/recommendations/for-me');
    },

    getEmployerJobs: async (params: { page?: number; limit?: number; status?: string } = {}): Promise<ApiResponse<{ jobs: Job[]; pagination: any }>> => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      const queryString = queryParams.toString();
      return this.request(`/jobs/employer/my-jobs${queryString ? `?${queryString}` : ''}`);
    },
  };

  // Applications endpoints
  applications = {
    apply: async (jobId: string, applicationData: {
      coverLetter?: string;
      proposedSalary?: number;
      availability?: string;
    }): Promise<ApiResponse<{ application: Application }>> => {
      return this.request(`/applications/jobs/${jobId}/apply`, {
        method: 'POST',
        body: JSON.stringify(applicationData),
      });
    },

    getMyApplications: async (params: { page?: number; limit?: number; status?: string } = {}): Promise<ApiResponse<{ applications: Application[]; pagination: any }>> => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      const queryString = queryParams.toString();
      return this.request(`/applications/my-applications${queryString ? `?${queryString}` : ''}`);
    },

    getJobApplications: async (jobId: string, params: { page?: number; limit?: number; status?: string } = {}): Promise<ApiResponse<{ applications: Application[]; job: Job; pagination: any }>> => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      const queryString = queryParams.toString();
      return this.request(`/applications/jobs/${jobId}${queryString ? `?${queryString}` : ''}`);
    },

    getById: async (id: string): Promise<ApiResponse<{ application: Application }>> => {
      return this.request(`/applications/${id}`);
    },

    updateStatus: async (id: string, status: string, note?: string): Promise<ApiResponse<{ application: Application }>> => {
      return this.request(`/applications/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, note }),
      });
    },

    withdraw: async (id: string): Promise<ApiResponse> => {
      return this.request(`/applications/${id}/withdraw`, { method: 'POST' });
    },

    getStats: async (): Promise<ApiResponse> => {
      return this.request('/applications/employer/stats');
    },

    scheduleInterview: async (id: string, interviewData: {
      scheduledAt: string;
      location?: string;
      type?: string;
      notes?: string;
    }): Promise<ApiResponse<{ application: Application }>> => {
      return this.request(`/applications/${id}/interview`, {
        method: 'POST',
        body: JSON.stringify(interviewData),
      });
    },

    getByJob: async (jobId: string, params: { page?: number; limit?: number; status?: string } = {}): Promise<ApiResponse<{ applications: Application[]; job: Job; pagination: any }>> => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      const queryString = queryParams.toString();
      return this.request(`/applications/jobs/${jobId}${queryString ? `?${queryString}` : ''}`);
    },
  };

  // Users endpoints (for profile management)
  users = {
    getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
      return this.request('/users/profile');
    },

    updateProfile: async (profileData: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
      return this.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    },
  };

  // Messages endpoints (placeholder for future implementation)
  messages = {
    getAll: async (): Promise<ApiResponse> => {
      return this.request('/messages');
    },

    send: async (messageData: any): Promise<ApiResponse> => {
      return this.request('/messages', {
        method: 'POST',
        body: JSON.stringify(messageData),
      });
    },
  };
}

const api = new ApiService();
export default api;

// Export types for use in components
export type { Job, Application, User, ApiResponse }; 

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';

export const getMessages = async (conversationId: string, token: string) => {
  const res = await fetch(`${API_BASE}/messages?conversationId=${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const sendMessage = async (
  conversationId: string,
  receiver: string,
  content: string,
  token: string
) => {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ conversationId, receiver, content }),
  });
  return res.json();
}; 

export const getConversations = async (token: string) => {
  const res = await fetch(`${API_BASE}/messages/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}; 
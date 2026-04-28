/**
 * API Service for CodePulse
 * Provides CRUD operations for all backend endpoints
 */

const API_BASE = '/api';
const TOKEN_KEY = 'codepulse_token';

function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// ============================================
// TYPES
// ============================================

export interface ChatSession {
  id: number;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface Snippet {
  id: number;
  title: string;
  code: string;
  language: string;
  tags: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromptTemplate {
  id: number;
  name: string;
  prompt: string;
  category: string;
  variables: string[];
  createdAt: string;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  language: string;
  notifications: boolean;
  autoSync: boolean;
  syncInterval: number;
  defaultBranch: string;
}

export interface Analytics {
  totalRequests: number;
  totalSyncs: number;
  lastSyncTime: string | null;
  requestHistory: AnalyticsRecord[];
}

export interface AnalyticsRecord {
  type: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalRequests: number;
  totalSyncs: number;
  lastSyncTime: string | null;
  todayRequests: number;
}

// ============================================
// GENERIC REQUEST HELPER
// ============================================

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  const headers = new Headers(options?.headers || {});

  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || 'API request failed');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ============================================
// AUTH API
// ============================================

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  profilePicUrl?: string | null;
  provider: 'local' | 'google';
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  register: (data: FormData) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: data,
    }),

  login: (data: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  googleLogin: (credential: string) =>
    request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),

  updateProfilePic: (file: File) => {
    const formData = new FormData();
    formData.append('profilePic', file);
    return request<{ user: AuthUser }>('/auth/profile-pic', {
      method: 'PUT',
      body: formData,
    });
  },

  me: () => request<AuthUser>('/auth/me'),
};

// ============================================
// CHAT SESSIONS API
// ============================================

export const chatApi = {
  getAll: () => request<ChatSession[]>('/chats'),

  getById: (id: number) => request<ChatSession>(`/chats/${id}`),

  create: (data: { title?: string; messages?: ChatMessage[] }) =>
    request<ChatSession>('/chats', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: { title?: string; messages?: ChatMessage[] }) =>
    request<ChatSession>(`/chats/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/chats/${id}`, { method: 'DELETE' }),
};

// ============================================
// SNIPPETS API
// ============================================

export interface SnippetFilters {
  language?: string;
  tag?: string;
  search?: string;
}

export const snippetApi = {
  getAll: (filters?: SnippetFilters) => {
    const params = new URLSearchParams();
    if (filters?.language) params.append('language', filters.language);
    if (filters?.tag) params.append('tag', filters.tag);
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString();
    return request<Snippet[]>(`/snippets${query ? `?${query}` : ''}`);
  },

  getById: (id: number) => request<Snippet>(`/snippets/${id}`),

  create: (data: {
    title?: string;
    code: string;
    language?: string;
    tags?: string[];
    description?: string;
  }) =>
    request<Snippet>('/snippets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (
    id: number,
    data: {
      title?: string;
      code?: string;
      language?: string;
      tags?: string[];
      description?: string;
    }
  ) =>
    request<Snippet>(`/snippets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/snippets/${id}`, { method: 'DELETE' }),
};

// ============================================
// PROMPT TEMPLATES API
// ============================================

export const templateApi = {
  getAll: (category?: string) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return request<PromptTemplate[]>(`/templates${query}`);
  },

  getById: (id: number) => request<PromptTemplate>(`/templates/${id}`),

  create: (data: {
    name?: string;
    prompt: string;
    category?: string;
    variables?: string[];
  }) =>
    request<PromptTemplate>('/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (
    id: number,
    data: {
      name?: string;
      prompt?: string;
      category?: string;
      variables?: string[];
    }
  ) =>
    request<PromptTemplate>(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/templates/${id}`, { method: 'DELETE' }),
};

// ============================================
// SETTINGS API
// ============================================

export const settingsApi = {
  get: () => request<UserSettings>('/settings'),

  update: (data: Partial<UserSettings>) =>
    request<UserSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  reset: () =>
    request<UserSettings>('/settings/reset', { method: 'POST' }),
};

// ============================================
// ANALYTICS API
// ============================================

export const analyticsApi = {
  get: () => request<Analytics>('/analytics'),

  getSummary: () => request<AnalyticsSummary>('/analytics/summary'),

  recordSync: () =>
    request<Analytics>('/analytics/sync', { method: 'POST' }),

  reset: () => request<void>('/analytics', { method: 'DELETE' }),
};

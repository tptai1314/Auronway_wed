const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get token from localStorage (client-side only)
function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

// Helper function for API calls
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  try {
    const token = getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Đã có lỗi xảy ra',
      };
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: 'Không thể kết nối đến server',
    };
  }
}

// =====================================
// EVENT APIs
// =====================================

export interface EventData {
  title: string;
  description?: string;
  type: 'WORKSHOP' | 'COMPETITION' | 'SEMINAR' | 'VOLUNTEER' | 'TRAINING';
  mode: 'OFFLINE' | 'ONLINE' | 'HYBRID';
  status?: 'DRAFT' | 'APPROVED' | 'CANCELLED';
  start_at: string;
  end_at: string;
  registration_open_at?: string;
  registration_close_at?: string;
  location?: string;
  meeting_url?: string;
  cover_image_url?: string;
  media_urls?: string[];
  tags?: string[];
  skills?: { skill_id: string; xp_reward: number }[];
  campus_id: string;
  organizer_id: string;
}

export interface Event extends EventData {
  _id: string;
  tenant_id: string;
  created_by: string;
  registered_count: number;
  attended_count: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: Event[];
}

// Get all events
export async function getEvents(params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  q?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.status && params.status !== 'all') searchParams.set('status', params.status);
  if (params?.type && params.type !== 'all') searchParams.set('type', params.type);
  if (params?.q) searchParams.set('q', params.q);

  const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return fetchAPI<EventsResponse>(`/events${query}`);
}

// Get single event
export async function getEvent(id: string) {
  return fetchAPI<Event>(`/events/${id}`);
}

// Create event
export async function createEvent(data: EventData) {
  return fetchAPI<Event>('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Update event
export async function updateEvent(id: string, data: Partial<EventData>) {
  return fetchAPI<Event>(`/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Delete/Cancel event
export async function deleteEvent(id: string) {
  return fetchAPI<Event>(`/events/${id}`, {
    method: 'DELETE',
  });
}

// Get event registrations
export async function getEventRegistrations(eventId: string) {
  return fetchAPI<Registration[]>(`/events/${eventId}/registrations`);
}

// =====================================
// USER APIs
// =====================================

export interface UserData {
  email: string;
  password?: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
    student_id?: string;
    major?: string;
    bio?: string;
    phone?: string;
  };
  roles?: string[];
  is_active?: boolean;
}

export interface User {
  _id: string;
  email: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
    student_id?: string;
    major?: string;
    bio?: string;
    phone?: string;
  };
  roles: string[];
  is_active: boolean;
  stats?: {
    total_xp: number;
    level: number;
    completed_events: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: User[];
}

// Get all users (admin)
export async function getUsers(params?: {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  q?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.role && params.role !== 'all') searchParams.set('role', params.role);
  if (params?.status && params.status !== 'all') searchParams.set('status', params.status);
  if (params?.q) searchParams.set('q', params.q);

  const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return fetchAPI<UsersResponse>(`/admin/users${query}`);
}

// Get single user
export async function getUser(id: string) {
  return fetchAPI<User>(`/admin/users/${id}`);
}

// Create user (admin)
export async function createUser(data: UserData) {
  return fetchAPI<User>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Update user (admin)
export async function updateUser(id: string, data: Partial<UserData>) {
  return fetchAPI<User>(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Toggle user status (lock/unlock)
export async function toggleUserStatus(id: string, is_active: boolean) {
  return fetchAPI<User>(`/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active }),
  });
}

// Delete user
export async function deleteUser(id: string) {
  return fetchAPI<User>(`/admin/users/${id}`, {
    method: 'DELETE',
  });
}

// =====================================
// REGISTRATION APIs
// =====================================

export interface Registration {
  _id: string;
  event_id: string;
  user_id: string | {
    _id: string;
    email: string;
    profile?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
  status: 'REGISTERED' | 'ATTENDED' | 'CANCELLED';
  registered_at: string;
  attended_at?: string;
  xp_awarded: boolean;
}

// Get registrations for event
export async function getRegistrations(eventId: string) {
  return fetchAPI<Registration[]>(`/events/${eventId}/registrations`);
}

// =====================================
// AUTH APIs
// =====================================

export async function login(email: string, password: string) {
  return fetchAPI<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return fetchAPI('/auth/logout', {
    method: 'POST',
  });
}

export async function getMe() {
  return fetchAPI<User>('/auth/me');
}

// =====================================
// STATS APIs
// =====================================

export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalUsers: number;
  totalRegistrations: number;
  checkedInCount: number;
}

export async function getDashboardStats() {
  return fetchAPI<DashboardStats>('/admin/stats');
}

// =====================================
// UPLOAD APIs
// =====================================

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/upload-image`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Upload thất bại',
      };
    }

    return result;
  } catch (error) {
    console.error('Upload Error:', error);
    return {
      success: false,
      error: 'Không thể upload ảnh',
    };
  }
}

// =====================================
// SKILLS APIs
// =====================================

export interface Skill {
  _id: string;
  name: string;
  label_vi?: string;
  code: string;
  category_id: {
    _id: string;
    name: string;
    label_vi?: string;
  };
}

export async function getAllSkills() {
  return fetchAPI<Skill[]>('/admin/skills');
}

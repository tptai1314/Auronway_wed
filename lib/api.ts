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
  organizer_id?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.status && params.status !== 'all') searchParams.set('status', params.status);
  if (params?.type && params.type !== 'all') searchParams.set('type', params.type);
  if (params?.q) searchParams.set('q', params.q);
  if (params?.organizer_id) searchParams.set('organizer_id', params.organizer_id);

  const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
  console.log('getEvents API call with query:', query)
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
  organizer_id?: string;
  campus_id?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.role && params.role !== 'all') searchParams.set('role', params.role);
  if (params?.status && params.status !== 'all') searchParams.set('status', params.status);
  if (params?.q) searchParams.set('q', params.q);
  if (params?.organizer_id) searchParams.set('organizer_id', params.organizer_id);
  if (params?.campus_id) searchParams.set('campus_id', params.campus_id);

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

// Search users (for adding members to clubs)
export async function searchUsers(query: string) {
  const searchParams = new URLSearchParams();
  searchParams.set('q', query);
  searchParams.set('limit', '20');
  return fetchAPI<UsersResponse>(`/admin/users?${searchParams.toString()}`);
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
// USER PROFILE APIs
// =====================================

export interface UserProfile {
  id: string;
  email: string;
  profile: {
    full_name?: string;
    avatar_url?: string;
    student_id?: string;
    major?: string;
    bio?: string;
    date_of_birth?: string;
    phone?: string;
    links?: {
      github?: string;
      linkedin?: string;
      portfolio?: string;
    };
  };
  stats: {
    total_xp: number;
    level: number;
    streak: number;
    completed_events: number;
    certificates_count: number;
  };
}

export async function getMyProfile() {
  return fetchAPI<UserProfile>('/users/me/profile');
}

export async function updateMyProfile(data: Partial<UserProfile['profile']>) {
  return fetchAPI<UserProfile>('/users/me/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function uploadUserAvatar(file: File) {
  const formData = new FormData();
  formData.append('avatar', file);

  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
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
      error: 'Không thể upload avatar',
    };
  }
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

// =====================================
// AVATAR MANAGEMENT APIs
// =====================================

export interface AvatarData {
  name: string;
  image_url: string;
  is_default?: boolean;
  is_active?: boolean;
  order?: number;
}

export interface AdminAvatar extends AvatarData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAvatarsResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: AdminAvatar[];
}

export async function getAdminAvatars(params?: {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  is_default?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.q) searchParams.set('q', params.q);
  if (params?.status && params.status !== 'all') searchParams.set('status', params.status);
  if (params?.is_default && params.is_default !== 'all') searchParams.set('is_default', params.is_default);

  const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return fetchAPI<AdminAvatarsResponse>(`/admin/avatars${query}`);
}

export async function createAdminAvatar(data: AvatarData) {
  return fetchAPI<AdminAvatar>('/admin/avatars', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminAvatar(id: string, data: Partial<AvatarData>) {
  return fetchAPI<AdminAvatar>(`/admin/avatars/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminAvatar(id: string) {
  return fetchAPI(`/admin/avatars/${id}`, {
    method: 'DELETE',
  });
}

// =====================================
// ORGANIZERS/CLUBS APIs
// =====================================

export interface Organizer {
  _id: string;
  tenant_id: string;
  campus_id?: string;
  name: string;
  description?: string;
  type: 'CLUB' | 'DEPARTMENT' | 'EXTERNAL';
  email?: string;
  logo_url?: string;
  is_private?: boolean;
  is_active: boolean;
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  reviewers?: string[];
  approvers?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrganizerMember {
  user_id: {
    _id: string;
    email: string;
    profile?: {
      full_name?: string;
      avatar_url?: string;
      student_id?: string;
    };
  };
  role: 'CLUB_ADMIN' | 'EVENT_MANAGER' | 'REVIEWER' | 'APPROVER';
  joined_at: string;
}

export async function getOrganizers(tenantId?: string) {
  const params = new URLSearchParams()
  if (tenantId) params.append('tenantId', tenantId)
  
  return fetchAPI<Organizer[]>(`/organizers?${params.toString()}`);
}

export async function getOrganizerById(id: string) {
  console.log('Calling API: GET /organizers/' + id)
  return fetchAPI<Organizer>(`/organizers/${id}`);
}

export async function createOrganizer(data: {
  name: string;
  type: 'CLUB' | 'DEPARTMENT' | 'OFFICE' | 'COMMITTEE';
  description?: string;
  contact_email?: string;
  logo_url?: string;
  campus_id: string;
  tenant_id: string;
}) {
  return fetchAPI<Organizer>(`/organizers`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOrganizer(id: string, data: Partial<{
  name: string;
  description?: string;
  contact_email?: string;
  logo_url?: string;
}>) {
  return fetchAPI<Organizer>(`/organizers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteOrganizer(id: string) {
  return fetchAPI(`/organizers/${id}`, {
    method: 'DELETE',
  });
}

export async function getOrganizerMembers(organizerId: string) {
  return fetchAPI<{ organizer: Organizer; members: OrganizerMember[] }>(
    `/organizers/${organizerId}/members`
  );
}

export async function addOrganizerMember(organizerId: string, userId: string, role: string) {
  return fetchAPI(`/organizers/${organizerId}/members/add`, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, role }),
  });
}

export async function removeOrganizerMember(organizerId: string, userId: string) {
  return fetchAPI(`/organizers/${organizerId}/members/${userId}`, {
    method: 'DELETE',
  });
}

export async function updateOrganizerPrivacy(organizerId: string, isPrivate: boolean) {
  return fetchAPI(`/organizers/${organizerId}/privacy`, {
    method: 'PATCH',
    body: JSON.stringify({ is_private: isPrivate }),
  });
}

// =====================================
// QR CODE CHECK-IN APIs
// =====================================

export interface QRCodeData {
  event_id: string;
  qr_code_token: string;
  expires_at: string;
  is_active?: boolean;
  is_valid?: boolean;
  max_scans: number | null;
  scan_count: number;
  check_ins_count?: number;
}

// Generate QR code for an event
export async function generateEventQRCode(eventId: string, options?: {
  expires_in_hours?: number;
  max_scans?: number;
}) {
  return fetchAPI<QRCodeData>(`/events/${eventId}/qr-code`, {
    method: 'POST',
    body: JSON.stringify(options || {}),
  });
}

// Get QR code info for an event
export async function getEventQRCode(eventId: string) {
  return fetchAPI<QRCodeData>(`/events/${eventId}/qr-code`);
}

// Deactivate QR code for an event
export async function deactivateEventQRCode(eventId: string) {
  return fetchAPI(`/events/${eventId}/qr-code`, {
    method: 'DELETE',
  });
}

// Delete QR code for an event (hard delete)
export async function deleteEventQRCode(eventId: string) {
  return fetchAPI(`/events/${eventId}/qr-code/delete`, {
    method: 'DELETE',
  });
}

// Check-in by QR code (for mobile)
export async function checkinByQRCode(qrToken: string, location?: { lat: number; lng: number }, deviceInfo?: Record<string, unknown>) {
  return fetchAPI('/events/qr-checkin', {
    method: 'POST',
    body: JSON.stringify({
      qr_token: qrToken,
      location,
      device_info: deviceInfo,
    }),
  });
}

// Get today's events that can have check-in sessions
export async function getTodayEvents() {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()
  
  return fetchAPI<EventsResponse>(`/events?start_date=${startOfDay}&end_date=${endOfDay}&status=APPROVED`);
}

import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Types ─────────────────────────────────────────────────────────────
export type UserRole = 'customer' | 'provider' | 'admin';
export type ProviderCategory = 'live_band' | 'solo_artist' | 'dj' | 'venue';
export type BookingStatus = 'requested' | 'confirmed' | 'completed' | 'settled' | 'cancelled';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Package {
  id: number;
  name: string;
  duration: string;
  price: number;
  features: string[];
  is_active: boolean;
}

export interface Provider {
  id: number;
  slug: string;
  name: string;
  category: ProviderCategory;
  city: string;
  tagline?: string;
  bio?: string;
  rating: number;
  review_count: number;
  verified: boolean;
  cover_image?: string;
  packages: Package[];
}

export interface Booking {
  id: number;
  booking_ref: string;
  provider_id: number;
  package_id: number;
  event_date: string;
  status: BookingStatus;
  total_amount: number;
  advance_amount: number;
  final_amount: number;
  notes?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
  provider?: Provider;
  package?: Package;
  customer?: User;
}

export interface Review {
  id: number;
  booking_id: number;
  rating: number;
  content?: string;
  created_at: string;
  customer?: User;
}

export interface StudioOverview {
  total_revenue: number;
  revenue_change: number;
  pending_requests: number;
  expiring_soon: number;
  upcoming_events: number;
  next_event_date?: string;
  acceptance_rate: number;
}

export interface ActivityItem {
  customer_name: string;
  package_name: string;
  event_date: string;
  amount: number;
  status: BookingStatus;
}

// ── Auth ──────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; name: string; password: string; role?: string }) =>
    API.post('/auth/register', data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    API.post('/auth/login', data).then((r) => r.data),
  me: () => API.get<User>('/auth/me').then((r) => r.data),
};

// ── Providers ─────────────────────────────────────────────────────────
export const providersApi = {
  list: (params?: { category?: string; max_price?: number; min_rating?: number; city?: string }) =>
    API.get<Provider[]>('/providers', { params }).then((r) => r.data),
  featured: () => API.get<Provider[]>('/providers/featured').then((r) => r.data),
  get: (slug: string) => API.get<Provider>(`/providers/${slug}`).then((r) => r.data),
  create: (data: { name: string; category: string; city: string; tagline?: string; bio?: string }) =>
    API.post<Provider>('/providers', data).then((r) => r.data),
  reviews: (slug: string) => API.get<Review[]>(`/providers/${slug}/reviews`).then((r) => r.data),
};

// ── Packages ──────────────────────────────────────────────────────────
export const packagesApi = {
  list: () => API.get<Package[]>('/packages').then((r) => r.data),
  create: (data: { name: string; duration: string; price: number; features: string[] }) =>
    API.post<Package>('/packages', data).then((r) => r.data),
  update: (id: number, data: Partial<Package>) =>
    API.put<Package>(`/packages/${id}`, data).then((r) => r.data),
  delete: (id: number) => API.delete(`/packages/${id}`).then((r) => r.data),
};

// ── Bookings ──────────────────────────────────────────────────────────
export const bookingsApi = {
  create: (data: { provider_id: number; package_id: number; event_date: string; notes?: string }) =>
    API.post<Booking>('/bookings', data).then((r) => r.data),
  list: () => API.get<Booking[]>('/bookings').then((r) => r.data),
  get: (ref: string) => API.get<Booking>(`/bookings/${ref}`).then((r) => r.data),
  updateStatus: (ref: string, status: BookingStatus) =>
    API.put(`/bookings/${ref}/status`, { status }).then((r) => r.data),
};

// ── Reviews ───────────────────────────────────────────────────────────
export const reviewsApi = {
  create: (data: { booking_id: number; rating: number; content?: string }) =>
    API.post<Review>('/reviews', data).then((r) => r.data),
};

// ── Studio ────────────────────────────────────────────────────────────
export const studioApi = {
  overview: () => API.get<StudioOverview>('/studio/overview').then((r) => r.data),
  bookings: () => API.get<Booking[]>('/studio/bookings').then((r) => r.data),
  activity: () => API.get<ActivityItem[]>('/studio/activity').then((r) => r.data),
};

// ── Payments ───────────────────────────────────────────────────────────
export const paymentsApi = {
  createOrder: (booking_id: number) =>
    API.post<{ razorpay_order_id: string; amount: number; currency: string }>('/payments/create-order', { booking_id }).then((r) => r.data),
  verifyPayment: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    API.post<{ status: string; message: string }>('/payments/verify', data).then((r) => r.data),
};

// ── Helpers ───────────────────────────────────────────────────────────
export const formatINR = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const categoryLabel: Record<ProviderCategory, string> = {
  live_band: 'Live Band',
  solo_artist: 'Solo Artist',
  dj: 'DJ',
  venue: 'Venue',
};

export const statusLabel: Record<BookingStatus, string> = {
  requested: 'Requested',
  confirmed: 'Confirmed',
  completed: 'Completed',
  settled: 'Settled',
  cancelled: 'Cancelled',
};

export default API;

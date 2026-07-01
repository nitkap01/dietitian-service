export type HealthGoal = 'weight_management' | 'sugar_control' | 'pcos' | 'other';
export type Gender = 'male' | 'female' | 'other';
export type ClientStatus = 'active' | 'inactive';
export type PaymentStatus = 'paid' | 'unpaid' | 'pending';
export type NotificationType = 'health_metric_request' | 'payment_reminder' | 'whatsapp';
export type NotificationFrequency = 'weekly' | 'biweekly' | 'monthly' | 'custom';
export type WeightFrequency = 'weekly' | 'biweekly' | 'monthly';
export type DietPlanStatus = 'draft' | 'published';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: Gender;
  health_goal: HealthGoal;
  status: ClientStatus;
  inactive_reason?: string;
  notes?: string;
  address?: string;
  password_set_at?: string;
  portal_last_login?: string;
  has_credentials?: boolean; // computed in API responses (never the hash itself)
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: number;
  name: string;
  description?: string;
  category: HealthGoal;
  price: number;
  duration_months: number;
  benefits?: string; // JSON array of benefit strings
  request_weights: number; // 0/1
  weight_frequency?: WeightFrequency;
  created_at: string;
  active_clients?: number;
}

export interface ClientPackage {
  id: number;
  client_id: number;
  package_id: number;
  start_date: string;
  end_date?: string;
  is_active: number;
  created_at: string;
  package_name?: string;
  package_price?: number;
  package_category?: string;
}

export interface HealthMetric {
  id: number;
  client_id: number;
  weight_kg: number;
  recorded_at: string;
  source: 'manual' | 'email' | 'whatsapp';
  notes?: string;
}

export interface DietPlan {
  id: number;
  client_id: number;
  title: string;
  issues?: string;
  status: DietPlanStatus;
  published_at?: string;
  created_at: string;
}

export interface DietPlanVersion {
  id: number;
  diet_plan_id: number;
  version_number: number;
  image_path?: string;
  ocr_data?: string;
  changelog?: string;
  created_at: string;
}

export interface Payment {
  id: number;
  client_id: number;
  package_id?: number;
  amount: number;
  status: PaymentStatus;
  screenshot_path?: string;
  notes?: string;
  source?: string;
  detected_message_id?: number;
  detection_confidence?: number;
  paid_at?: string;
  due_date?: string;
  created_at: string;
  client_name?: string;
  package_name?: string;
}

export interface Notification {
  id: number;
  client_id: number;
  type: NotificationType;
  frequency?: NotificationFrequency;
  custom_days?: number;
  message?: string;
  next_send_at?: string;
  last_sent_at?: string;
  is_active: number;
  created_at: string;
  client_name?: string;
}

export interface Image {
  id: number;
  client_id: number;
  path: string;
  type: 'diet_plan' | 'payment' | 'progress';
  created_at: string;
}

export interface MealItem {
  id: number;
  name: string;
  category: 'breakfast' | 'lunch' | 'snacks' | 'dinner' | 'any';
  calories_per_serving?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
  serving_size?: string;
  health_tags?: string;
  notes?: string;
  created_at: string;
}

export interface WhatsAppMessage {
  id: number;
  client_id: number;
  direction: 'inbound' | 'outbound';
  message: string;
  phone_number?: string;
  media_path?: string;
  media_type?: string;
  intent?: string;
  parsed_weight?: number;
  payment_detected: number;
  is_read: number;
  received_at: string;
  created_at: string;
  client_name?: string;
}

export interface PortalNotification {
  id: number;
  client_id: number;
  type: 'diet_published' | 'weight_requested' | 'payment_received' | 'general';
  title: string;
  body?: string;
  is_read: number;
  created_at: string;
}

export interface DashboardStats {
  total_clients: number;
  active_clients: number;
  inactive_clients: number;
  total_revenue: number;
  pending_payments: number;
  pending_amount: number;
}

export interface ActivityItem {
  id: number;
  type: 'client_added' | 'payment_received' | 'diet_plan_updated' | 'metric_recorded' | 'client_deactivated';
  description: string;
  client_name: string;
  created_at: string;
}

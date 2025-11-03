// Core Types
export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface User extends BaseEntity {
  email: string;
  full_name: string;
  role: "admin" | "teacher" | "student";
  timezone: string;
  language: string;
  avatar_url?: string;
  two_factor_enabled: boolean;
  is_active: boolean;
}

export interface UserProfile extends BaseEntity {
  user_id: string;
  bio?: string;
  phone?: string;
  address?: string;
  date_of_birth?: Date;
  notification_preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

// Test Management Types
export interface Subject extends BaseEntity {
  name: string;
  description?: string;
  code: string;
  is_active: boolean;
  created_by: string;
}

export interface Question extends BaseEntity {
  subject_id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false" | "short_answer" | "essay";
  difficulty: "easy" | "medium" | "hard";
  points_value: number;
  time_limit?: number;
  options?: Record<string, unknown>;
  correct_answer?: string;
  explanation?: string;
  tags?: string[];
  created_by: string;
  is_active: boolean;
}

export interface TestTemplate extends BaseEntity {
  name: string;
  description?: string;
  subject_id: string;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  total_points: number;
  instructions?: string;
  randomize_questions: boolean;
  allow_retakes: boolean;
  show_results_immediately: boolean;
  enable_time_limit: boolean;
  auto_grade: boolean;
  created_by: string;
  is_active: boolean;
}

export interface Test extends BaseEntity {
  template_id?: string;
  title: string;
  description?: string;
  subject_id: string;
  start_time?: Date;
  end_time?: Date;
  duration: number;
  max_attempts: number;
  passing_score: number;
  allow_review: boolean;
  shuffle_questions: boolean;
  created_by: string;
  status: "draft" | "scheduled" | "in_progress" | "completed" | "cancelled";
}

// Student Management Types
export interface StudentGroup extends BaseEntity {
  name: string;
  description?: string;
  color: string;
  created_by: string;
  is_active: boolean;
}

export interface GroupMember extends BaseEntity {
  group_id: string;
  user_id: string;
  role: "member" | "assistant";
}

// Test Assignment Types
export interface TestAssignment extends BaseEntity {
  test_id: string;
  group_id: string;
  assigned_by: string;
  due_date?: Date;
  allow_late_submission: boolean;
  max_attempts: number;
  reminder_enabled: boolean;
  reminder_minutes_before: number;
  status: "assigned" | "in_progress" | "completed" | "expired";
}

// Test Taking Types
export interface TestAttempt extends BaseEntity {
  test_id: string;
  user_id: string;
  assignment_id?: string;
  attempt_number: number;
  started_at: Date;
  completed_at?: Date;
  time_spent?: number;
  score?: number;
  max_score?: number;
  percentage?: number;
  status: "in_progress" | "completed" | "timed_out" | "submitted";
  ip_address?: string;
  browser_info?: string;
}

export interface TestResponse extends BaseEntity {
  attempt_id: string;
  test_question_id: string;
  question_id: string;
  response_text?: string;
  selected_options?: Record<string, unknown>;
  is_correct?: boolean;
  points_earned?: number;
  time_spent?: number;
  answered_at: Date;
}

// Learning Path Types
export interface LearningPath extends BaseEntity {
  name: string;
  description?: string;
  target_group?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_duration?: number;
  is_active: boolean;
  adaptive_learning_enabled: boolean;
  created_by: string;
}

export interface PathMilestone extends BaseEntity {
  path_id: string;
  title: string;
  description?: string;
  target_score: number;
  order_index: number;
}

export interface StudentProgress extends BaseEntity {
  path_id: string;
  user_id: string;
  milestone_id?: string;
  current_score?: number;
  target_score?: number;
  status: "not_started" | "in_progress" | "completed" | "mastered";
  started_at?: Date;
  completed_at?: Date;
  last_activity: Date;
  progress_percentage: number;
}

// System Types
export interface Report extends BaseEntity {
  title: string;
  report_type:
    | "test_performance"
    | "student_progress"
    | "group_analytics"
    | "system_usage";
  generated_by: string;
  report_data: Record<string, unknown>;
  filters?: Record<string, unknown>;
  is_scheduled: boolean;
  schedule_frequency?: "daily" | "weekly" | "monthly" | "quarterly";
  recipients?: string[];
}

export interface Message extends BaseEntity {
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  is_deleted_by_sender: boolean;
  is_deleted_by_recipient: boolean;
  sent_at: Date;
  read_at?: Date;
  parent_message_id?: string;
}

export interface SystemSetting extends BaseEntity {
  setting_key: string;
  setting_value: string;
  description?: string;
  data_type: "string" | "number" | "boolean" | "json";
  is_system: boolean;
  updated_by: string;
}

export interface AuditLog extends BaseEntity {
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}

// API Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FilterOptions {
  search?: string;
  status?: string;
  date_from?: Date;
  date_to?: Date;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// UI Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

export interface DashboardStats {
  total_participants: number;
  active_tests: number;
  upcoming_tests: number;
  average_score: number;
  completion_rate: number;
}

export interface RecentResult {
  id: string;
  student_name: string;
  score: number;
  status: "completed" | "in_progress" | "failed";
  completed_at: Date;
  test_name: string;
}

// Form Types
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormState<T> {
  data: T;
  errors: FormErrors;
  isLoading: boolean;
  isDirty: boolean;
}

// Socket Types
export interface SocketEvent {
  type: string;
  payload: unknown;
  timestamp: Date;
}

export interface TestUpdateEvent {
  test_id: string;
  status: string;
  user_id: string;
  timestamp: Date;
}

// Hook Types
export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: unknown[]) => Promise<void>;
  reset: () => void;
}

export interface UseDebounceOptions {
  delay?: number;
  leading?: boolean;
  trailing?: boolean;
}

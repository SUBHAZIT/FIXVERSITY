export type AppRole = 'student' | 'worker' | 'admin' | 'faculty';
export type IssueCategory = 'electrical' | 'plumbing' | 'hvac' | 'cleaning' | 'it' | 'furniture' | 'safety' | 'other';
export type IssueStatus = 'open' | 'in_progress' | 'resolved';
export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  student_code?: string | null;
  faculty_id?: string | null;
  worker_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Issue {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  building: string;
  room_number: string;
  image_url: string | null;
  assigned_to: string | null;
  resolved_at: string | null;
  admin_notes: string | null;
  estimated_time?: number | null;
  rating?: number | null;
  created_at: string;
  updated_at: string;
}

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  hvac: 'HVAC',
  cleaning: 'Cleaning',
  it: 'IT Support',
  furniture: 'Furniture',
  safety: 'Safety',
  other: 'Other',
};

export const STATUS_LABELS: Record<IssueStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export const PRIORITY_LABELS: Record<IssuePriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const BUILDINGS = [
  'Main Academic Building',
  'Science Center',
  'Library',
  'Student Center',
  'Engineering Hall',
  'Arts Building',
  'Administration Building',
  'Dormitory A',
  'Dormitory B',
  'Sports Complex',
  'Cafeteria',
  'Parking Structure',
];

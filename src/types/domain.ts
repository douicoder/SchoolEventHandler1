export type UserRole = "student" | "teacher" | "admin";
export type ProfileStatus = "pending" | "approved" | "rejected";
export type ApplicationStatus = "applied" | "selected" | "rejected";
export type EventStatus = "open" | "closed" | "completed";

export interface Profile {
  id: string;
  full_name: string;
  class: number;
  yob: number;
  admission_no: string;
  father_name: string;
  email: string;
  role: UserRole;
  status: ProfileStatus;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  spots_needed: number;
  class_min?: number;
  class_max?: number;
  status: EventStatus;
  created_by: string;
  created_at: string;
}

export interface Application {
  id: string;
  event_id: string;
  student_id: string;
  status: ApplicationStatus;
  created_at: string;
  selected_at: string | null;
}

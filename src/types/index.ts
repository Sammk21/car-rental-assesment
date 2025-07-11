export interface Listing {
  id: number;
  title: string;
  description: string;
  make: string;
  model: string;
  year: number;
  price_per_day: number;
  location: string;
  image_url: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  listing_id: number;
  admin_username: string;
  action: string;
  old_values: string;
  new_values: string;
  created_at: string;
}

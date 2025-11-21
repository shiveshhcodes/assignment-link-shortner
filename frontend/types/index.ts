export interface Link {
  code: string;
  target: string;
  total_clicks: number;
  last_clicked: string | null; // ISO date string or null
  created_at: string; // ISO date string
}

export interface CreateLinkRequest {
  target: string;
  code?: string;
}

export interface CreateLinkResponse extends Link {}

export interface ApiError {
  message: string;
  field?: string;
}

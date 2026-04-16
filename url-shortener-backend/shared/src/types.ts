export interface ShortenedUrl {
  id: number;
  code: string;
  long_url: string;
  created_at: Date;
}

export interface ClickEvent {
  code: string;
  timestamp: string;
}

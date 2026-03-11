export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  end_date: string | null;
  location: string | null;
  image_url: string | null;
  luma_url: string | null;
  luma_id: string | null;
  is_past: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

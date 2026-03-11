export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

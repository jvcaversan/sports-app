export interface Club {
  id: string;
  created_at: string;
  name: string;
  photo?: string | null;
  created_by: string;
  creator_name?: string | null;
}

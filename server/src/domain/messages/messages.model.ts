export type GetDirectMessageResponse = {
  id: number;
  content: string;
  is_read: boolean;
  isOwn: boolean;
  created_at: Date;
  sender: string;
};

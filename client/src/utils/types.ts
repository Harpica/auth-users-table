export type Status = 'active' | 'blocked';

export interface UserData {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  lastVisit: string;
  status: Status;
}

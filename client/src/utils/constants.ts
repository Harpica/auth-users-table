import { Status } from './types';

export const DEFAULT_USER = {
  id: 0,
  name: 'default',
  email: 'default@email.com',
  createdAt: Date.now().toString(),
  lastVisit: Date.now().toString(),
  status: 'active' as Status,
};

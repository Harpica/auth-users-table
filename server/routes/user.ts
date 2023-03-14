import express from 'express';
import {
  createUser,
  deleteUsers,
  getUsers,
  updateUsersStatus,
} from '../controllers/user';

export const user = express.Router();

user.get('/users', getUsers);
user.post('/users', createUser);
user.delete('/users', deleteUsers);
user.patch('/users/status', updateUsersStatus);

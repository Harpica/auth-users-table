import express from 'express';
import {
  createUser,
  deleteUsers,
  getUsers,
  login,
  updateUsersStatus,
} from '../controllers/user';
import { auth } from '../middlewares/auth';

export const user = express.Router();

user.post('/users/login', login);
user.post('/users', createUser);

// Protedted routes
user.use(auth);
user.get('/users', getUsers);
user.delete('/users', deleteUsers);
user.patch('/users/status', updateUsersStatus);

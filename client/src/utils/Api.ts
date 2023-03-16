import axios from 'axios';

import { Status } from './types';

export const BASE_URL = process.env.REACT_APP_BASE_URL || 'localhost';

axios.defaults.withCredentials = true;

export class Api {
  constructor() {}

  getUsers() {
    return axios.get(`http://${BASE_URL}:5000/users/`);
  }

  loginUser(email: string, password: string) {
    console.log(BASE_URL);
    return axios.post(`http://${BASE_URL}:5000/users/login`, {
      data: {
        email: email,
        password: password,
      },
    });
  }

  createUser(name: string, email: string, password: string) {
    return axios.post(`http://${BASE_URL}:5000/users`, {
      data: {
        name: name,
        email: email,
        password: password,
      },
    });
  }

  deleteUsers(ids: Array<number>) {
    return axios.delete(`http://${BASE_URL}:5000/users`, {
      data: {
        ids: ids,
      },
    });
  }

  changeUsersStatus(ids: Array<number>, status: Status) {
    return axios.patch(`http://${BASE_URL}:5000/users/status`, {
      data: {
        ids: ids,
        status: status,
      },
    });
  }
}

export const api = new Api();

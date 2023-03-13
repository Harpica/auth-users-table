import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';
import { PrismaClient } from '@prisma/client';

// Usage of .env file in the root dir
dotenv.config();

const app = express();

const HOST = process.env.APP_HOST || 'localhost';
const PORT = process.env.APP_PORT || 5000;
// const DATABASE_PORT = parseInt(process.env.DATABASE_PORT || '', 10) || 3306;
// const DATABASE_NAME = process.env.MYSQL_DATABASE || 'users-table-mysql';
// const DATABASE_USER = process.env.DATABASE_USER || 'root';
// const DATABASE_PASSWORD = process.env.MYSQL_ROOT_PASSWORD;

// const connection = mysql.createConnection({
//   host: HOST,
//   port: DATABASE_PORT,
//   user: DATABASE_USER,
//   password: DATABASE_PASSWORD,
//   database: DATABASE_NAME,
// });

// To get full req.body in JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connection.connect(function (err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack, err, connection);
//     return;
//   }

//   console.log('connected as id ' + connection.threadId);
// });

const prisma = new PrismaClient();

// prisma.user
//   .create({
//     data: {
//       email: 'aa@gmail.com',
//       name: 'First User',
//     },
//   })
//   .then((res) => console.log(res));

prisma.user.findMany().then((res) => console.log(res));

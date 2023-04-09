import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import knex from 'knex';
import { handleApiCall, image } from './controllers/image.js';
import handleProfile from './controllers/profile.js';
import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';

const postgresDatabase = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'smartreco'
  }
});

const app = express();

let salt = bcrypt.genSaltSync(10);

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send(database.users)
// })
app.post("/signin", (req, res) => {
  handleSignin(req, res, bcrypt, postgresDatabase)
})
app.post("/register", (req, res) => { handleRegister(req, res, bcrypt, salt, postgresDatabase) });

app.get("/profile/:id", (req, res) => {
  handleProfile(req, res, postgresDatabase)
})
app.put("/image", (req, res) => { image(req, res, postgresDatabase) })
app.post("/imageurl", (req, res) => { handleApiCall(req, res) })

app.listen(3000, () => {
  console.log("App is running on Port:3000")
})
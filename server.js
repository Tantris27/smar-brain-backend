import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import knex from 'knex';

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
// console.log(postgresDatabase.select('*').from('users'))
const app = express();
const database = {
  users: [
    {
      id: "1",
      name: "Waluigi",
      email: "waluigi@gmail.com",
      password: "marioSucks",
      joined: new Date(),
      entries: 0
    },
    {
      id: "2",
      name: "Browser",
      email: "browser@gmail.com",
      password: "marioSucks",
      joined: new Date(),
      entries: 0
    }, {
      id: "3",
      name: "simba",
      email: "lionking@gmail.com",
      password: "scarCanKiss",
      joined: new Date(),
      entries: 0
    }
  ]
}

let salt = bcrypt.genSaltSync(10);
// let hash = bcrypt.hashSync("B4c0/\/", salt);

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(database.users)
})
app.post("/signin", (req, res) => {
  // bcrypt.compareSync(req.body.password, database.users[database.users.length - 1].password);
  // console.log(bcrypt.compareSync(req.body.password, database.users[database.users.length - 1].password))
  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("Error logging in.")
  }
})
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password, salt);
  postgresDatabase('users')
    .returning('*')
    .insert({
      name,
      email,
      joined: new Date()
    })
    .then(user => { res.json(user[0]) })
    .catch(err => { res.status(400).json('unable to register!') })
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user)
    }
  })
  if (!found) {
    res.status(404).json("User not found")
  }
})
app.put("/image", (req, res) => {
  const { id } = req.body;
  console.log(id)
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++
      return res.json(user.entries)
    }
  })
  if (!found) {
    res.status(404).json("User not found")
  }
})
app.listen(3000, () => {
  console.log("App is running on Port:3000")
})
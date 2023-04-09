const handleRegister = (req, res, bcrypt, salt, postgresDatabase) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('no empty input!')
  }
  const hash = bcrypt.hashSync(password, salt);
  postgresDatabase.transaction(trx => {
    trx.insert({
      hash,
      email
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        trx('users')
          .returning('*')
          .insert({
            name,
            email: loginEmail[0].email,
            joined: new Date()
          })
          .then(user => { res.json(user[0]) })
      }).then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => { res.status(400).json('unable to register!') })
}
// module.exports = {
//   handleRegister: handleRegister
// };
export default handleRegister;
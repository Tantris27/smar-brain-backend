const handleProfile = (req, res, postgresDatabase) => {
  const { id } = req.params;
  postgresDatabase.select('*').from('users').where({
    id
  }).then(user => {
    if (user.length) {
      res.json(user[0])
    } else {
      res.status(404).json("User not found")
    }
  })
}
export default handleProfile;
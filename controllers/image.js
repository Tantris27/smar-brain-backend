import Clarifai from 'clarifai';

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI
});

const handleApiCall = (req, res) => {
  app.models.predict('face-detection', req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}
const image = (req, res, postgresDatabase) => {
  const { id } = req.body;
  postgresDatabase('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0].entries))
    .catch(err => res.status(404).json("Unable to comply"))
}
export { handleApiCall, image };
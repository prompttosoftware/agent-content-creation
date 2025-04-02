const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/text', (req, res) => {
  console.log('Received text:', req.body);
  res.send('Text received');
});

app.post('/image', (req, res) => {
  console.log('Received image:', req.body);
  res.send('Image received');
});

app.post('/done', (req, res) => {
    console.log('Received done:', req.body);
    res.send('Done received');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
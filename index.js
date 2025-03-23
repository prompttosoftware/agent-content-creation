const express = require('express');
const app = express();
const port = 3000;

const helloRouter = require('./api/hello');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/hello', helloRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
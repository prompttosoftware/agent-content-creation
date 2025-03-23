const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// New API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
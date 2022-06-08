const express = require('express');
const app = express();
const port = 3000;
const router = require('express').Router();
const clients = {};

app.listen(port, () => {
  console.log(`App listening to port ${port}`);
});

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) res.sendStatus(400);
  else next();
});

router.post('/client/:id', async (req, res) => {
  const id = req.params.id;
  clients[id] = {};
  clients[id].promise = new Promise((resolve, _) => {
    clients[id].resolve = resolve;
  });
  const result = await clients[id].promise;
  clients[id] = undefined;
  res.json(result);
});

router.post('/webhook/:id', async (req, res) => {
  const id = req.params.id;
  if (clients[id] === undefined) return res.sendStatus(404);
  clients[id].resolve(req.body);
  res.sendStatus(200);
})

app.use(router);

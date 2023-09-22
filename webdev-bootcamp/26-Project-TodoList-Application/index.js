import express from 'express';

import path from "path";
import { fileURLToPath } from 'url';

function getPath(relPath) {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), relPath);
}

const app = express();
const port = 3000;

const state = new class ServerState {
  constructor() {
    this.todoItems = [];
    this.workItems = [];
  }
}();

app.use(express.static(getPath('public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render(getPath('views/index.ejs'), {
    items: state.todoItems,
    title: new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" }),
    submitPath: '/submit',
  });
});

app.get('/work', (req, res) => {
  res.render(getPath('views/index.ejs'), {
    items: state.workItems,
    title: 'Work List',
    submitPath: '/work/submit',
  });
});

function postHandler(req, res, items, redirect = "/") {
  const item = req.body["new-item"];
  items.push(item);
  res.redirect(redirect);
}

app.post('/submit', (res, req) => postHandler(res, req, state.todoItems));
app.post('/work/submit', (res, req) => postHandler(res, req, state.workItems, "/work"));

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
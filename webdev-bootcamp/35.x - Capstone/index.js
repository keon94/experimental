import express from 'express';
import mongoose from 'mongoose';

import path from "path";
import { fileURLToPath } from 'url';

function getPath(relPath) {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), relPath);
}

const app = express();
const port = 3000;

app.use(express.static(getPath('public')));
app.use(express.urlencoded({ extended: true }));

await mongoose.connect('mongodb://127.0.0.1:27017/listDB', { useNewUrlParser: true, useUnifiedTopology: true });
const Item = mongoose.model("Item", mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: props => `${props.value} cannot be empty!`
    },
  },
  type: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v === "todo" || v === "work";
      },
      message: props => `${props.value} is not a valid item type!`
    },
  }
}));

app.get('/', async (req, res) => {
  let items = await Item.find({ type: "todo" });
  res.render(getPath('views/index.ejs'), {
    items: items.map(x => x.name),
    title: new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" }),
    submitPath: '/submit',
    deletePath: '/delete',
  });
});

app.get('/work', async (req, res) => {
  let items = await Item.find({ type: "work" });
  res.render(getPath('views/index.ejs'), {
    items: items.map(x => x.name),
    title: 'Work List',
    submitPath: '/work/submit',
    deletePath: '/work/delete',
  });
});

async function deleteHandler(req, res, itemType) {
  let items = req.body['items'];
  try {
    await Item.deleteMany({ name: { $in: items }, type: itemType });
    return res.status(200).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function postHandler(req, res, itemType, redirect = "/") {
  const item = req.body["new-item"];
  try {
    await new Item({ name: item, type: itemType }).save();
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e.message);
    }
    return res.status(500).send(e.message);
  }
  return res.redirect(redirect);
}

app.post('/submit', (res, req) => postHandler(res, req, "todo"));
app.post('/work/submit', (res, req) => postHandler(res, req, "work", "/work"));
app.delete('/delete', (res, req) => deleteHandler(res, req, "todo"));
app.delete('/work/delete', (res, req) => deleteHandler(res, req, "work"));

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
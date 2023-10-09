import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';

const app = express();
const port = 4000;

// In-memory data store
const articles = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];

const client = await mongoose.connect('mongodb://127.0.0.1:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });
const Article = client.model("Article", mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  title: String,
  content: String,
  author: String,
  date: Date,
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function initDB() {
  let count = await Article.count({});
  if (count === 0) {
    await Article.insertMany(articles);
  }
}

//Write your code here//

//CHALLENGE 1: GET All posts
app.get('/posts', async (req, res) => {
  const articles = await Article.find({})
  res.json(articles);
});

//CHALLENGE 2: GET a specific post by id
app.get('/posts/:id', async (req, res) => {
  let docId = parseInt(req.params.id);
  const article = await Article.findOne({ id: parseInt(docId) });
  res.json(article);
});

//CHALLENGE 3: POST a new post
app.post('/posts', async (req, res) => {
  let post = req.body;
  if (!post.title || !post.content || !post.author) {
    res.sendStatus(400);
    return;
  }
  let id = new Date().getTime();
  post.id = id;
  post.date = new Date();
  const article = new Article({
    id: id,
    title: post.title,
    content: post.content,
    author: post.author,
  });
  await article.save();
  res.json(article);
});

//CHALLENGE 4: PATCH a post when you just want to update one parameter
app.patch('/posts/:id', async (req, res) => {
  let update = {};
  if (req.body.title) {
    update['title'] = req.body.title;
  }
  if (req.body.content) {
    update['content'] = req.body.content;
  }
  if (req.body.author) {
    update['author'] = req.body.author;
  }
  let id = parseInt(req.params.id);
  let article = await Article.findOneAndUpdate({ id: parseInt(id) }, update, { new: true })
  res.json(article);
});

//CHALLENGE 5: DELETE a specific post by providing the post id.
app.delete('/posts/:id', async (req, res) => {
  let docId = parseInt(req.params.id);
  await Article.deleteOne({ id: parseInt(docId) })
  res.sendStatus(200);
});

initDB();

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});

import express from "express";
import bodyparser from "body-parser";
import morgan from "morgan";

import path from "path";
import { fileURLToPath } from 'url';

function getPath(relPath) {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), relPath);
}

const app = express();
const port = 3000;

function customMiddleware(req, res, next) {
  console.log("req.url: ", req.url, " req.method: ", req.method);
  next();
}

// middleware
// this is needed to parse the body of a POST request, otherwise it'll be undefined
app.use(bodyparser.urlencoded({ extended: true }));
// for logging
app.use(morgan("tiny", { skip: (req, res) => {
  return false;
} }));
// custom
app.use(customMiddleware);

// routes
app.get("/", (req, res) => {
  // get current directory
  // let contents1 = fs.readFileSync(path.resolve(__dirname, "index.html"));
  // let contents2 = fs.readFileSync(path.resolve(__dirname, "helper.html"));
  res.sendFile(getPath("public/index.html"));
  // res.sendFile(path.resolve(__dirname, "helper.html"));
});

app.post("/submit", (req, res) => {
  let obj = req.body;
  res.send(`<h1>Your Band Name:</h1><h2>${obj.pet} ${obj.street}</h2>`);
});

app.post("/register", (req, res) => {
  res.status(201).send("<h1>Created</h1>");
});

app.post("/login", (req, res) => {
  res.status(405).send("not impl'd");
})
  

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});


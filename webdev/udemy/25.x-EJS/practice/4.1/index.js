import express from "express";

import path from "path";
import { fileURLToPath } from 'url';

function getPath(relPath) {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), relPath);
}

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const data = {
    title: "EJS Tags",
    seconds: new Date().getSeconds(),
    items: ["apple", "banana", "cherry"],
    htmlContent: "<strong>This is some strong text</strong>",
  };
  res.render(getPath("./views/index.ejs"), data);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

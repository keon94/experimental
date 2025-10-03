import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';

function getPath(relPath) {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), relPath);
}

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(getPath("./public")));

app.get("/", (req, res) => {
  res.render(getPath("./views/index.ejs"));
});

app.post("/submit", (req, res) => {
  const fName = req.body.fName;
  const lName = req.body.lName;
  res.render(getPath("./views/index.ejs"), { fName: fName, lName: lName });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

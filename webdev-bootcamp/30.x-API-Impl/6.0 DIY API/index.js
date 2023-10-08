import express from "express";
import bodyParser from "body-parser";
import { jokes, Joke } from "./jokes.js";

const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.method === "DELETE") {
    // Check if the request has the master key
    if (req.headers["key"] !== masterKey) {
      res.status(401).send("Invalid key");
      return;
    }
  }
  next();
});

//1. GET a random joke
app.get("/random", (req, res) => {
  let joke = jokes[Math.floor(Math.random() * jokes.length)];
  res.send(joke);
});

//2. GET a specific joke
app.get("/jokes/:id", (req, res) => {
  let joke = jokes.filter((joke) => {
    return joke.id === req.params.id;
  });
  if (joke.length === 0) {
    res.status(404).send("No joke found.");
  }
  res.send(joke[0]);
});

//3. GET a jokes by filtering on the joke type
app.get("/filter", (req, res) => {
  let joke = jokes.filter((joke) => {
    return joke.jokeType === req.query.type;
  });
  if (joke.length === 0) {
    res.status(404).send("No joke found.");
  }
  res.send(joke[0]);
});

//4. POST a new joke
app.post("/jokes", (req, res) => {
  let joke = req.body;
  if (!validate(joke.text, joke.type)) {
    res.status(400).send("Missing field on joke");
  }
  let id = jokes[jokes.length - 1].id + 1;
  let newJoke = new Joke(id, joke.type, joke.text)
  jokes.push(newJoke);
  res.status(201).send(newJoke);
});

function validate(...fields) {
  for (let field of fields) {
    if (field === null || field === "") {
      return false;
    }
  }
  return true;
}

//5. PUT a joke
app.put("/jokes/:id", (req, res) => {
  if (!validate(req.body.text, req.body.type)) {
    res.status(400).send("Missing field on joke");
  }
  let id = parseInt(req.params.id);
  let jokeIndex = jokes.findIndex((joke) => {
    return joke.id === id;
  });
  if (jokeIndex == -1) {
    res.status(404).send("No joke found.");
    return;
  }
  jokes[jokeIndex] = new Joke(id, req.body.type, req.body.text);
  res.status(200).send(joke);
});

//6. PATCH a joke
app.patch("/jokes/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let joke = jokes.find((joke) => {
    return joke.id === id;
  });
  if (joke == null) {
    res.status(404).send("No joke found.");
  }
  if (req.body.text) {
    joke.jokeText = req.body.text;
  }
  if (req.body.type) {
    joke.jokeType = req.body.type;
  }
  res.status(200).send(joke);
});

//7. DELETE Specific joke
app.delete("/jokes/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let index = -1;
  let joke = jokes.find((joke, idx) => {
    if (joke.id === id) {
      index = idx;
      return true;
    }
    return false;
  });
  if (joke == null) {
    res.status(404).send("No joke found.");
    return;
  }
  jokes.splice(index, 1);
  res.sendStatus(200);
});

//8. DELETE All jokes
app.delete("/all", (req, res) => {
  jokes.splice(0, jokes.length);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});


import express from "express";
import axios from "axios";

import path from "path";
import { fileURLToPath } from 'url';
import { randomUUID } from "crypto";

class Session {
  constructor(uname, pword, key, token) {
    this.auth = {
      basic: {
        username: uname,
        password: pword,
      },
      api: {
        key: key,
      },
      bearer: {
        token: token,
      },
    };
  }
}

const userIdCache = new Set();

function getPath(relPath) {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), relPath);
}

let session;

async function cacheSecretIds() {
  if (userIdCache.size === 0) {
    try {
      let resp = await axios.get(`${API_URL}/user-secrets`, {
        headers: {
          Authorization: `Bearer ${session.auth.bearer.token}`,
        },
      });
      resp.data.forEach((secret) => {
        userIdCache.add(secret.id);
      });
    }
    catch (err) {
      console.error(err);
      throw new Error("Failed to cache secret Ids.", { cause: err });
    }
  }
}

async function postRandomSecrets(count = 1) {
  for (let i = 0; i < count; i++) {
    try {
      let resp = await axios.post(`${API_URL}/secrets`, {
        secret: "This is a randomly generated secret.",
        score: Math.floor(Math.random() * 10) + 1,
      }, {
        headers: {
          Authorization: `Bearer ${session.auth.bearer.token}`,
        },
      });
      await cacheSecretIds();
    } catch (err) {
      console.error(err);
      throw new Error("Failed to post random secrets.", { cause: err })
    }
  }
}

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

const defaultSession = new Session("", "", "", "");
let cachedSession;
session = defaultSession;

app.get("/", (req, res) => {
  res.render(getPath("views/index.ejs"), { content: "API Response." });
});

app.post("/register", async (req, res) => {
  if (session !== defaultSession) {
    res.render(getPath("views/index.ejs"), { content: "Already registered!" });
    return;
  }
  try {
    if (cachedSession) {
      session = cachedSession;
      await postRandomSecrets(1);
      res.render(getPath("views/index.ejs"), { content: "Successfully re-registered!" });
      return;
    }
    let uname = randomUUID();
    let pword = randomUUID();
    await axios.post(`${API_URL}/register`, {
      username: uname,
      password: pword,
    });
    let resp;
    resp = await axios.get(`${API_URL}/generate-api-key`);
    let apiKey = resp.data.apiKey;
    resp = await axios.post(`${API_URL}/get-auth-token`, {
      username: uname,
      password: pword,
    });
    let token = resp.data.token;
    session = new Session(uname, pword, apiKey, token);
    cachedSession = session;
    await postRandomSecrets(1);
    res.render(getPath("views/index.ejs"), { content: "Successfully Registered!" });
  } catch (err) {
    console.error(err);
    res.render(getPath("views/index.ejs"), { content: err.message });
  }
});

app.post("/unregister", async (req, res) => {
  if (!session) {
    res.render(getPath("views/index.ejs"), { content: "There was no registration!" });
    return;
  }
  session = defaultSession;
  res.render(getPath("views/index.ejs"), { content: "Successfully Unregistered!" });
});

app.get("/noAuth", async (req, res) => {
  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
  try {
    let resp = await axios.get(`${API_URL}/random`);
    res.render(getPath("views/index.ejs"), { content: JSON.stringify(resp.data) });
  } catch (err) {
    console.error(err);
    res.render(getPath("views/index.ejs"), { content: err.message });
  }
});

app.get("/basicAuth", async (req, res) => {
  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  try {
    let resp = await axios.get(`${API_URL}/all`, {
      auth: {
        username: session.auth.basic.username,
        password: session.auth.basic.password,
      },
    });
    resp.data.forEach((secret) => {
      userIdCache.add(secret.id);
    });
    res.render(getPath("views/index.ejs"), { content: JSON.stringify(resp.data) });
  } catch (err) {
    console.error(err);
    res.render(getPath("views/index.ejs"), { content: err.message });
  }
});

app.get("/apiKey", async (req, res) => {
  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
  try {
    let resp = await axios.get(`${API_URL}/filter`, {
      params: {
        embarrassment_level: 5,
        apiKey: session.auth.api.key,
      },
    });
    res.render(getPath("views/index.ejs"), { content: JSON.stringify(resp.data) });
  } catch (err) {
    console.error(err);
    res.render(getPath("views/index.ejs"), { content: err.message });
  }
});

app.get("/bearerToken", async (req, res) => {
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
  try {
    await cacheSecretIds();
    const id = (() => {
      let vals = userIdCache.values();
      let index = Math.floor(Math.random() * userIdCache.size);
      let iter = vals.next();
      for (let i = 0; i < index; i++) {
        iter = vals.next();
      }
      return iter.value;
    })();
    let resp = await axios.get(`${API_URL}/secrets/${id}`, {
      headers: {
        Authorization: `Bearer ${session.auth.bearer.token}`,
      },
    });
    res.render(getPath("views/index.ejs"), { content: JSON.stringify(resp.data) });
  } catch (err) {
    console.error(err);
    res.render(getPath("views/index.ejs"), { content: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

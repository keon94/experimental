import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

import path from "path";
import { fileURLToPath } from 'url';

function getPath(relPath) {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), relPath);
}

const app = express();
const port = 3000;

app.use(express.static(getPath("public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Step 1: Make sure that when a user visits the home page,
//   it shows a random activity.You will need to check the format of the
//   JSON data from response.data and edit the index.ejs file accordingly.
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    res.render(getPath("views/index.ejs"), { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render(getPath("views/index.ejs"), {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  const type = req.body.type;
  const participants = req.body.participants;
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/filter", {
      timeout: 10000,
      params: {
        "type": type,
        "participants": participants,
      },
    });
    let activities = response.data;
    const activity = activities[Math.floor(Math.random() * activities.length)];
    res.render(getPath("views/index.ejs"), { data: activity });
  } catch (error) {
    let message = error.message;
    console.error("Failed to make request:", message);
    if (error.response.status === 404) {
      message = `No activities that match your criteria (type: ${type}, participants: ${participants}).`;
    }
    res.render(getPath("views/index.ejs"), {
      error: message,
    });
  }

  // Step 2: Play around with the drop downs and see what gets logged.
  // Use axios to make an API request to the /filter endpoint. Making
  // sure you're passing both the type and participants queries.
  // Render the index.ejs file with a single *random* activity that comes back
  // from the API request.
  // Step 3: If you get a 404 error (resource not found) from the API request.
  // Pass an error to the index.ejs to tell the user:
  // "No activities that match your criteria."
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

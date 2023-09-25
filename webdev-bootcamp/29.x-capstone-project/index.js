// HINTS:
// 1. Import express and axios

// 2. Create an express app and set the port number.

// 3. Use the public folder for static files.

// 4. When the user goes to the home page it should render the index.ejs file.

// 5. Use axios to get a random secret and pass it to index.ejs to display the
// secret and the username of the secret.

// 6. Listen on your predefined port and start the server.

import express, { response } from 'express';
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

app.get("/", async (req, res) => {
    try {
        res.render(getPath("views/index.ejs"), {});
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render(getPath("views/index.ejs"), {});
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
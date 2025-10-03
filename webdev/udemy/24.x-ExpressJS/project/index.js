//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming


import express from 'express';
import bodyParser from 'body-parser';

import path from "path";
import { fileURLToPath } from 'url';

function getPath(relPath) {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), relPath);
}


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(getPath('public/index.html'));
});

app.post('/check', (req, res) => {
    if (req.body.password === 'ILoveProgramming') {
        res.sendFile(getPath('public/secret.html'));
        return;
    }
    res.sendFile(getPath('public/index.html'));
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
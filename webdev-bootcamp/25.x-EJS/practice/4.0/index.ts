import { Application, Request, Response } from "express";
import express from "express";
import ejs from "ejs";

import path from "path";
import { fileURLToPath } from 'url';

function getPath(relPath: string): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), relPath);
}

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static(getPath("./public")));

app.get("/", (req: Request, res: Response) => {
    let promise = ejs.renderFile(getPath("./view/index.ejs"), { day: new Date().getDay() }) as Promise<string>;
    promise.then((html) => {
        res.send(html);
    });
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
import express from "express";
import bodyParser from "body-parser";

import mongoose, { Model } from "mongoose";
import ejs from "ejs";

import getPath from "./helper/path.js"
import encrypt from "mongoose-encryption"

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const dbClient = await mongoose.connect('mongodb://127.0.0.1:27017/secretDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const secret = "thisisourlittlesecret";

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

app.use(express.static(getPath("public")));

app.get("/", function (req, res) {
    res.render(getPath("views/home.ejs"))
});

app.get("/login", function (req, res) {
    res.render(getPath("views/login.ejs"))
});

app.get("/register", function (req, res) {
    res.render(getPath("views/register.ejs"))
});


app.post("/submit", function (req, res) {
    res.render(getPath("views/secrets.ejs"))
});

endpointsWithBasicAuth();

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});

function endpointsWithBasicAuth() {
    const UserModel = dbClient.model("User", mongoose.Schema({
        email: { type: String, required: true, unique: true, },
        password: { type: String, required: true },
    }));
    app.post("/login", async function (req, res) {
        try {
            const model = await UserModel.findOne({ email: req.body.username });
            if (!model) {
                return res.status(404).send("User not found")
            }
            if (model.password !== req.body.password) {
                return res.status(401).send("Wrong password")
            }
            res.render(getPath("views/secrets.ejs"))
        } catch (e) {
            return res.status(500).send(e.message);
        }
    });

    app.post("/register", async function (req, res) {
        const user = new UserModel({
            email: req.body.username,
            password: req.body.password,
        });
        try {
            await user.save();
        } catch (e) {
            return res.status(500).send(e.message);
        }
        res.render(getPath("views/secrets.ejs"))
    });
}

function endpointsWithEncryptedAuth() {
    const UserModel = dbClient.model("User", mongoose.Schema({
        email: { type: String, required: true, unique: true, },
        password: { type: String, required: true },
    }));
    app.post("/login", async function (req, res) {
        try {
            const model = await UserModel.findOne({ email: req.body.username });
            if (!model) {
                return res.status(404).send("User not found")
            }
            if (model.password !== req.body.password) {
                return res.status(401).send("Wrong password")
            }
            res.render(getPath("views/secrets.ejs"))
        } catch (e) {
            return res.status(500).send(e.message);
        }
    });

    app.post("/register", async function (req, res) {
        const user = new UserModel({
            email: req.body.username,
            password: req.body.password,
        });
        try {
            await user.save();
        } catch (e) {
            return res.status(500).send(e.message);
        }
        res.render(getPath("views/secrets.ejs"))
    });
}
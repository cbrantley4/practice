const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test");
const db = mongoose.connection;

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let db_status = "MongoDB connection not successful";

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => (db_status = "Successful opened connection to Mongo!"));

const postSchema = new mongoose.Schema({
  title: String,
  body: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => res.send(db_status));

app.post("/posts", (req, res) => {
  const newPost = new Post(req.body);
  newPost.save((error, post) => {
    return error ? res.sendStatus().json(error) : res.json(post);
  });
});

app.get("/posts", (req, res) => {
  Post.find({}, (error, data) => {
    if (error) return res.sendStatus(500).json(error);
    return res.json(data);
  });
});

app.get("/posts/:postId", (req, res) => {
  Post.findById(req.params.postId, (error, data) => {
    if (error) return res.sendStatus(500).json(error);
    return res.json(data);
  });
});

app.put("/posts/:postId", (req, res) => {
  Post.findByIdAndUpdate(
    req.params.postId,
    { $set: { title: req.body.title, body: req.body.body } },
    (error, data) => {
      if (error) return res.sendStatus(500).json(error);
      return res.json(req.body);
    }
  );
});

app.delete("/posts/:postId", (req, res) => {
  Post.findByIdAndDelete(req.params.postId, {}, (error, data) => {
    if (error) return res.sendStatus(500).json(error);
    return res.json(data);
  });
});

app.listen(port, () => console.log(`Example app listening of port ${port}`));

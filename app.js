const express = require("express");
const {
  getAllTopics,
  getArticleID,
} = require("./controllers/ncnews.controller");
const app = express();

// app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleID);

///////////////////////////////////////

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "error 400: article_id is invalid" });
  } else {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;

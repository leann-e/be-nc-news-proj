const express = require("express");
const {
  getAllTopics,
  getArticleByID,
  patchArticle,
  getAllUsers,
  getAllArticles,
  getAllComments,
  postComment,
} = require("./controllers/ncnews.controller");
const app = express();

app.use(express.json());

// GET
app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/users", getAllUsers);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllComments);

// POST
app.post("/api/articles/:article_id/comments", postComment);

// PATCH
app.patch("/api/articles/:article_id", patchArticle);

///////////////////////////////////////

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "error 400: bad request." });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "error 404: not found." });
  }
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;

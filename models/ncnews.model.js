const db = require("../db/connection");
const format = require("pg-format");

// GET
exports.fetchAllTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows: topics }) => {
    return topics;
  });
};

exports.fetchArticleID = (id) => {
  return db
    .query(
      "SELECT users.username AS author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id JOIN users ON users.username = articles.author WHERE articles.article_id = $1 GROUP BY articles.article_id, users.username;",
      [id]
    )
    .then(({ rows: [article] }) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "error 404: not found.",
        });
      }
      return article;
    });
};

exports.fetchAllUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows: users }) => {
    return users;
  });
};

exports.fetchAllArticles = () => {
  return db
    .query(
      "SELECT users.username AS author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id JOIN users ON users.username = articles.author GROUP BY articles.article_id, users.username ORDER BY created_at DESC;"
    )
    .then(({ rows: articles }) => {
      return articles;
    });
};

// PATCH
exports.updateArticle = (id, votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*;",
      [votes, id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "error 404: not found.",
        });
      }
      return rows[0];
    });
};

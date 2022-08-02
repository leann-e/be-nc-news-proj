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
    .query("SELECT * FROM articles WHERE article_id = $1;", [id])
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

// PATCH
exports.updateArticle = (id, votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*;",
      [votes, id]
    )
    .then(({ rows }) => {
      if (!rows) {
        return Promise.reject({
          status: 404,
          msg: "error 404: not found.",
        });
      }
      return rows[0];
    });
};

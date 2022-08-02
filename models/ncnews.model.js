const db = require("../db/connection");
const format = require("pg-format");

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
          msg: "error 404: article_id not found",
        });
      }
      return article;
    });
};

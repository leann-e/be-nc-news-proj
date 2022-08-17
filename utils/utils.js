const db = require("../db/connection");

exports.checkIfArticleExists = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "error 404: not found.",
        });
      }
    });
};

exports.checkIfTopicExists = (slug) => {
  return db
    .query("SELECT * FROM topics WHERE slug = $1", [slug])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "error 404: not found.",
        });
      }
    });
};

const db = require("../db/connection");
const { checkIfTopicExists } = require("../utils/utils");
const format = require("pg-format");

// GET
exports.fetchAllTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows: topics }) => {
    return topics;
  });
};

exports.fetchArticleByID = (id) => {
  return db
    .query(
      "SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
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

exports.fetchAllArticles = (sort_by = "created at", order = "DESC", topic) => {
  let query = `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id `;

  let injectArr = [];
  if (topic) {
    injectArr.push(topic);
    query += `WHERE articles.topic = $1 `;
  }

  if (
    ![
      "articles.title",
      "articles.votes",
      "articles.created_at",
      "articles.author",
      "articles.comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "error 400: bad request." });
  }

  if (!["ASC", "DESC"].includes(order)) {
    return Promise.reject({ status: 400, msg: "error 400: bad request." });
  }

  query += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(query, injectArr).then(({ rows }) => {
    return rows;
  });
};

exports.fetchAllComments = (id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1;", [id])
    .then(({ rows: comments }) => {
      return comments;
    });
};

//POST
exports.addComment = (id, body, username) => {
  if (!body || !username) {
    return Promise.reject({
      status: 400,
      msg: "error 400: bad request.",
    });
  }
  return db
    .query(
      "INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *;",
      [id, body, username]
    )
    .then(({ rows: comment }) => {
      return comment[0];
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

// DELETE

const db = require("../db/connection");
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

exports.fetchAllArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const topicQuery = [];
  const validSortBy = [
    "title",
    "votes",
    "created_at",
    "author",
    "comment_count",
  ];
  const validOrder = ["ASC", "DESC"];

  let query = `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id `;

  if (topic) {
    topicQuery.push(topic);
    query += `WHERE articles.topic = $1 `;
  }

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "error 400: bad request." });
  }

  query += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(query, topicQuery).then(({ rows }) => {
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

exports.fetchApi = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((data) => {
    const parsedData = JSON.parse(data);
    return parsedData;
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
exports.removeCommentById = (id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING*", [id])
    .then(({ rows: [comment] }) => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: "error 404: not found.",
        });
      }
      return comment;
    });
};

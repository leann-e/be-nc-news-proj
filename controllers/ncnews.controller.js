const { convertTimestampToDate } = require("../db/seeds/utils");
const {
  fetchAllTopics,
  fetchArticleByID,
  updateArticle,
  fetchAllUsers,
  fetchAllArticles,
  fetchAllComments,
  addComment,
  removeCommentById,
} = require("../models/ncnews.model");
const { checkIfArticleExists, checkIfTopicExists } = require("../utils/utils");

// GET
exports.getAllTopics = (req, res) => {
  fetchAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllUsers = (req, res) => {
  fetchAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  // console.log(sort_by, order, topic);
  // checkIfTopicExists(topic)
  //   .then(() => {
  //     return
  fetchAllArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchAllComments(article_id), checkIfArticleExists(article_id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

// POST
exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  fetchArticleByID(article_id)
    .then(() => {
      return addComment(article_id, body, username);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

// PATCH
exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

// DELETE
exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

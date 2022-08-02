const { fetchAllTopics, fetchArticleID } = require("../models/ncnews.model");

exports.getAllTopics = (req, res) => {
  fetchAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

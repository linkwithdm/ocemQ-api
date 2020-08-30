const express = require("express");
const router = express.Router();

const QuestionModel = require("./../models/question.model");
const dbConfig = require("../configs/db.config");

router
  .route("/")
  .get((req, res, next) => {
    QuestionModel.find({})
      .then((data) => {
        if (data.length > 0) {
          res.json(data);
        } else {
          res.status(200).json({
            msg: "Questions not Found",
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  })
  .post((req, res, next) => {
    const newQuestion = new QuestionModel({});
    newQuestion.title = req.body.title;
    newQuestion.answers = req.body.answers;
    newQuestion.correct_answer_index = req.body.correct_answer_index;
    newQuestion.save(function (err, done) {
      if (err) {
        err.msg = "Error While Saving Question";
        return next(err);
      }
      res.json({
        msg: "Question Saved Sucessfully",
        qinfo: done,
      });
    });
  })
  .put((req, res, next) => {})
  .delete((req, res, next) => {});

router
  .route("/checkAnswer/:id")
  .get((req, res, next) => {})
  .post((req, res, next) => {
    QuestionModel.findOne({ _id: new dbConfig.oid(req.params.id) })
      .then((question) => {
        if (question) {
          if (question.correct_answer_index === req.body.answerSelectedByUser) {
            req.status(200).json({
              msg: "Selected answer matched",
            });
          } else {
            return next({
              msg: "Selected answer didnot matched",
            });
          }
        } else {
          next({
            msg: "Question not found",
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  })
  .put((req, res, next) => {})
  .delete((req, res, next) => {});

module.exports = router;

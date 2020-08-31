const express = require("express");
const router = express.Router();

const QuestionModel = require("./../models/question.model");
const UserModel = require("./../models/user.model");
const ScoreboardModel = require("./../models/scoreboard.model");
const dbConfig = require("../configs/db.config");

router
  .route("/")
  .get((req, res, next) => {
    QuestionModel.find({})
      .lean()
      .exec((err, data) => {
        if (err) {
          return next(err);
        }
        if (data.length > 0) {
          const newQ = data.map(function (obj, index) {
            obj.qid = index + 1;
            obj.correct_answer_index = undefined;
            obj.__v = undefined;
            return obj;
          });
          res.status(200).json(newQ);
        } else {
          res.status(200).json({
            msg: "Questions not Found",
          });
        }
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
    console.log(req.params.id);
    QuestionModel.findOne({ _id: new dbConfig.oid(req.params.id) })
      .then((question) => {
        // console.log(question);
        if (question) {
          //console.log("sfsq" + question);
          if (question.correct_answer_index === req.body.answerSelectedByUser) {
            userId = req.body.userId;
            UserModel.findOne(
              { _id: userId },
              {
                _id: 1,
                name: 1,
              }
            )
              .lean()
              .exec((err, userinfo) => {
                if (err) {
                  return next(err);
                } else {
                  if (!userinfo) {
                    return next({
                      msg: "User Doesnot exist in our system",
                    });
                  }
                  userinfo.userId = userinfo._id;
                  //  console.log(userinfo);
                  ScoreboardModel.findOne({
                    "person.userId": userinfo.userId,
                  }).then((result) => {
                    if (result == null) {
                      const newScoreboard = new ScoreboardModel({});
                      newScoreboard.person = userinfo;
                      newScoreboard.points = 5;
                      newScoreboard.save(function (errr, done) {
                        if (errr) {
                          errr.msg = "Error While Saving Scoreboard";
                          return next(errr);
                        }
                        res.json({
                          msg: "Selected answer matched",
                          info: done,
                        });
                      });
                    } else {
                      result.person = userinfo;
                      result.points = result.points + 5;
                      result.save(function (err, done) {
                        if (err) {
                          errr.msg = "Error While Saving Scoreboard";
                          return next(err);
                        }
                        res.json({
                          msg: "Selected answer matched",
                          info: done,
                        });
                      });
                    }
                  });
                }
              });
            // res.status(200).json({
            //   msg: "Selected answer matched",
            // });
          } else {
            return next({
              msg: "Selected answer didnot matched",
            });
          }
        } else {
          // console.log("sefcnj");
          return next({
            msg: "Question not found",
          });
        }
      })
      .catch((err) => {
        // console.log("wrrorrrrrrrrrrrrrrrrrrrrrrrrrrrr");
        console.log(err);
        next(err);
      });
  })
  .put((req, res, next) => {})
  .delete((req, res, next) => {});

module.exports = router;

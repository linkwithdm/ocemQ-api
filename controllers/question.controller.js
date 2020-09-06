const express = require("express");
const router = express.Router();

const QuestionModel = require("./../models/question.model");
const UserModel = require("./../models/user.model");
const ScoreboardModel = require("./../models/scoreboard.model");
const QuizHistoryModel = require("./../models/quizhistory.model");

const generateRandomJson = require("./../helpers/generateRandomJson");
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
            obj._id = undefined;
            obj.correct_answer_index = undefined;
            obj.__v = undefined;
            return obj;
          });
          generateRandomJson(newQ);
          res.status(200).json(newQ);
        } else {
          res.status(200).json({
            msg: "Questions not Found",
          });
        }
      });
  })
  .post((req, res, next) => {
    QuestionModel.find({})
      .then((question) => {
        //console.log(question.length);
        const newQuestion = new QuestionModel({});
        newQuestion.title = req.body.title;
        newQuestion.qid = question.length + 1;
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
      .catch((e) => {
        console.log(e);
      });
  })
  .put((req, res, next) => {})
  .delete((req, res, next) => {});

router
  .route("/checkAnswer/:qid/:answer/:username")
  .get((req, res, next) => {
    username = req.params.username.toLowerCase();
    //Check User in System
    UserModel.findOne({ username: username }, { uid: 1, name: 1 })
      .lean()
      .exec((err, userinfo) => {
        if (err) {
          return next(err);
        } else {
          if (!userinfo) {
            return next({
              msg: "User doesnot exist in our system",
            });
          }
          // console.log(userinfo);

          //Check Question in System

          QuestionModel.findOne({ qid: req.params.qid }).then((question) => {
            if (!question) {
              return next({
                msg: "Question not found",
              });
            }
            // console.log(question);
            //Check Question History
            QuizHistoryModel.find({
              qid: question.qid,
              uid: userinfo.uid,
            }).then((quizhistory) => {
              console.log(quizhistory);
              if (quizhistory.length > 0) {
                return next({
                  msg: "Already attempt",
                });
              } else {
                if (question.correct_answer_index === req.params.answer) {
                  //Answer Correct
                  // console.log("Correct Answer");
                  //Save in quiz history
                  const newQuizHistory = new QuizHistoryModel({});
                  newQuizHistory.qid = question.qid;
                  newQuizHistory.uid = userinfo.uid;
                  newQuizHistory.answer = "Correct Answer";

                  newQuizHistory.save((errorrr, saved) => {
                    if (errorrr) {
                      errr.msg = "Error While Saving Quiz History";
                      return next(errr);
                    }
                    //Save in scoreboard
                    ScoreboardModel.findOne({
                      "person.uid": userinfo.uid,
                    }).then((result) => {
                      if (result == null) {
                        const newScoreboard = new ScoreboardModel({});
                        newScoreboard.person = userinfo;
                        newScoreboard.points = 5;
                        console.log(newScoreboard);
                        newScoreboard.save(function (errr, done) {
                          if (errr) {
                            errr.msg = "Error While Saving Scoreboard";
                            return next(errr);
                          }
                          res.json({
                            msg: "Correct Answer",
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
                            msg: "Correct Answer",
                            info: done,
                          });
                        });
                      }
                    });
                  });
                } else {
                  // console.log("Wrong ANswer");
                  //Save in quiz history
                  const newQuizHistory = new QuizHistoryModel({});
                  newQuizHistory.qid = question.qid;
                  newQuizHistory.uid = userinfo.uid;
                  newQuizHistory.answer = "Wrong Answer";
                  newQuizHistory.save((errorrr, saved) => {
                    if (errorrr) {
                      errr.msg = "Error While Saving Quiz History";
                      return next(errr);
                    }
                    res.json({
                      msg: "Wrong Answer",
                    });
                  });
                }
              }
            });
          });
        }
      });
  })
  .post((req, res, next) => {})
  .put((req, res, next) => {})
  .delete((req, res, next) => {});

module.exports = router;

const express = require("express");
const router = express.Router();

const ScoreboardModel = require("./../models/scoreboard.model");
const dbConfig = require("../configs/db.config");

router
  .route("/")
  .get((req, res, next) => {
    ScoreboardModel.find(
      {},
      {
        __v: 0,
        _id: 0,
      }
    )
      .sort({ points: -1 })
      .exec((err, data) => {
        if (err) {
          return next(err);
        }
        if (data.length > 0) {
          res.status(200).json(data);
        } else {
          res.status(200).json({
            msg: "Score not Found",
          });
        }
      });
  })
  .post((req, res, next) => {})
  .put((req, res, next) => {})
  .delete((req, res, next) => {});

module.exports = router;

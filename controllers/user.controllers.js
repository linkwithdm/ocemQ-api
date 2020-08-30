const express = require("express");
const router = express.Router();
const UserModel = require("./../models/user.model");

router
  .route("/")
  .get((req, res, next) => {
    UserModel.find({})
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  })
  .post((req, res, next) => {})
  .put((req, res, next) => {})
  .delete((req, res, next) => {});

module.exports = router;

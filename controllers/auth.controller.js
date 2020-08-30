const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const UserModel = require("./../models/user.model");
router.post("/login", (req, res, next) => {
  UserModel.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (user) {
        const isMatched = bcrypt.compareSync(req.body.password, user.password);
        if (isMatched) {
          res.json({
            user,
          });
        } else {
          next({
            msg: "Invalid Password",
            status: 400,
          });
        }
      } else {
        next({
          msg: "Invalid Username",
          status: 400,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
});
router.post("/register", (req, res, next) => {
  UserModel.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (!user) {
        const newUser = new UserModel({});
        newUser.name = req.body.name;
        newUser.username = req.body.username;
        const hash = bcrypt.hashSync(req.body.password, saltRounds);
        newUser.password = hash;
        newUser.save(function (err, done) {
          if (err) {
            err.msg = "Error While Saving User";
            return next(err);
          }
          res.json({
            msg: "User Registered Sucessfully",
            userinfo: done,
          });
        });
      } else {
        next({
          msg: "Username Already Exist",
          status: 400,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

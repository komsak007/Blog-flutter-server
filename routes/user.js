const express = require("express");
const User = require("../models/users.model");
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware");

const router = express.Router();

router.get("/:username", middleware.checkToken, (req, res) => {
  User.findOne({ username: req.params.username }, (err, result) => {
    if (err) return res.status(500).json({ msg: err });

    res.json({
      data: result,
      username: req.params.username,
    });
  });
});

router.get("/checkusername/:username", (req, res) => {
  User.findOne({ username: req.params.username }, (err, result) => {
    if (err) return res.status(500).json({ msg: err });
    if (result !== null) {
      return res.json({
        Status: true,
      });
    } else {
      return res.json({
        Status: false,
      });
    }
  });
});

router.post("/login", (req, res) => {
  User.findOne({ username: req.body.username }, (err, result) => {
    if (err) return res.status(500).json({ msg: err });
    if (result === null) {
      return res
        .status(403)
        .json({ msg: "Either Username or Password incorrect!" });
    }

    if (result.password === req.body.password) {
      let token = jwt.sign({ username: req.body.username }, config.key, {
        expiresIn: "9999h",
      });
      res.json({ token, msg: "Success" });
    } else {
      res.status(403).json({ msg: "Either Username or Password incorrect!" });
    }
  });
});

//Register

router.post("/register", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });

  user
    .save()
    .then((user) => {
      console.log(user);
      res.status(200).json({ msg: "User Registed" });
    })
    .catch((err) => {
      res.status(403).json({ msg: err });
    });
});

// Update User

router.patch("/update/:username", middleware.checkToken, (req, res) => {
  User.findOneAndUpdate(
    { username: req.params.username },
    { $set: { password: req.body.password } },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      const msg = {
        msg: "password Successfully updated",
        username: req.params.username,
      };
      return res.json(msg);
    }
  );
});

router.delete("/delete/:username", middleware.checkToken, (req, res) => {
  User.findOneAndDelete({ username: req.params.username }, (err, result) => {
    if (err) return res.status(500).json({ msg: err });
    const msg = {
      msg: "User Deleted!",
      username: req.params.username,
    };
    return res.json(msg);
  });
});

module.exports = router;

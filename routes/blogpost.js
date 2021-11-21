const express = require("express");
const router = express.Router();
const BlogPost = require("../models/blogpost.model");
const middleWare = require("../middleware");

router.post("/Add", middleWare.checkToken, (req, res) => {
  const blogpost = new BlogPost({
    username: req.decoded.username,
    title: req.body.title,
    body: req.body.body,
  });

  blogpost
    .save()
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => {
      res.json({ err: err });
      console.log(err);
    });
});

module.exports = router;

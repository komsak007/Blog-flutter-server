const express = require("express");
const router = express.Router();
const BlogPost = require("../models/blogpost.model");
const middleWare = require("../middleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, res, cb) => {
    cb(null, req.params.id + ".jpg");
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 6 },
});

router.patch(
  "/add/coverImage/:id",
  middleWare.checkToken,
  upload.single("img"),
  (req, res) => {
    BlogPost.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          coverImage: req.file.path,
        },
      },
      { new: true },
      (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
      }
    );
  }
);

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

router.get("/getOwnBlog", middleWare.checkToken, (req, res) => {
  BlogPost.find({ username: req.decoded.username }, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result });
  });
});

router.get("/getOtherBlog", middleWare.checkToken, (req, res) => {
  BlogPost.find({ username: { $ne: req.decoded.username } }, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result });
  });
});

router.delete("/delete/:id", middleWare.checkToken, (req, res) => {
  BlogPost.findOneAndDelete(
    { $and: [{ username: req.decoded.username }, { _id: req.params.id }] },
    (err, result) => {
      if (err) return res.json(err);
      else if (result) {
        console.log(result);
        return res.json("Blog deleted");
      }
      return res.json("Blog not deleted");
    }
  );
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Profile = require("../models/profile.model");
const middleware = require("../middleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, res, cb) => {
    cb(null, req.decoded.username + ".jpg");
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 6 },
  // fileFilter: fileFilter,
});

router.patch(
  "/add/image",
  middleware.checkToken,
  upload.single("img"),
  (req, res) => {
    Profile.findOneAndUpdate(
      { username: req.decoded.username },
      {
        $set: {
          img: req.file.path,
        },
      },
      { new: true },
      (err, profile) => {
        if (err) return res.status(404).json(err);
        const response = {
          message: "image added successfully updated",
          data: profile,
        };
        return res.status(200).send(response);
      }
    );
  }
);

router.post("/add", middleware.checkToken, (req, res) => {
  const profile = new Profile({
    username: req.decoded.username,
    name: req.body.name,
    profession: req.body.profession,
    DOB: req.body.DOB,
    titleline: req.body.titleline,
    about: req.body.about,
  });

  profile
    .save()
    .then(() => {
      return res.json({ msg: "profile successfully stored" });
    })
    .catch((err) => {
      return res.status(400).json({ err: err });
    });
});

router.get("/checkProfile", middleware.checkToken, (req, res) => {
  Profile.findOne({ username: req.decoded.username }, (err, result) => {
    if (err) return res.json({ err: err });
    else if (result == null) {
      return res.json({ status: false });
    } else {
      return res.json({ status: true });
    }
  });
});

router.get("/getData", middleware.checkToken, (req, res) => {
  Profile.findOne({ username: req.decoded.username }, (err, result) => {
    if (err) return res.json(err);
    if (result === null) return res.json({ data: [] });
    else return res.json({ data: result });
  });
});

router.patch("/update", middleware.checkToken, (req, res) => {
  let profile = {};
  Profile.findOne({ username: req.decoded.username }, (err, result) => {
    if (err) {
      profile = {};
    }
    if (result != null) {
      profile = result;
    }
  });

  Profile.findOneAndUpdate(
    { username: req.decoded.username },
    {
      $set: {
        name: req.body.name ? req.body.name : profile.name,
        profession: req.body.profession
          ? req.body.profession
          : profile.profession,
        DOB: req.body.DOB ? req.body.DOB : profile.DOB,
        title: req.body.title ? req.body.title : profile.title,
        about: req.body.about ? req.body.about : profile.about,
      },
    },
    { new: true },
    (err, result) => {
      if (err) return res.json(err);
      if (result === null) return res.json({ data: [] });
      else return res.json({ data: result });
    }
  );
});

module.exports = router;

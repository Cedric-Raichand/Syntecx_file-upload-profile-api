const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const User = require("../models/User");


// STORAGE CONFIG
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  }

});


// FILE FILTER
const fileFilter = (req, file, cb) => {

  const allowedTypes = /jpg|jpeg|png|gif/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"));
  }

};


// MULTER CONFIG
const upload = multer({

  storage,

  limits: {
    fileSize: 2 * 1024 * 1024
  },

  fileFilter

});


// CREATE USER
router.post("/", async (req, res) => {

  try {

    const user = new User(req.body);

    await user.save();

    res.status(201).json(user);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// UPLOAD / UPDATE PROFILE PICTURE
router.put(
  "/:id/profile-picture",
  upload.single("image"),
  async (req, res) => {

    try {

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      // DELETE OLD IMAGE IF EXISTS
      if (
        user.profilePicture &&
        user.profilePicture.path
      ) {

        fs.unlink(
          user.profilePicture.path,
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );

      }

      // SAVE NEW IMAGE METADATA
      user.profilePicture = {
        filename: req.file.filename,
        path: req.file.path,
        url: `http://localhost:5000/uploads/${req.file.filename}`
      };

      await user.save();

      res.json({
        message: "Profile picture updated",
        profilePicture: user.profilePicture
      });

    } catch (err) {

      res.status(500).json({
        error: err.message
      });

    }

  }
);


// DELETE PROFILE PICTURE
router.delete(
  "/:id/profile-picture",
  async (req, res) => {

    try {

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      if (
        user.profilePicture &&
        user.profilePicture.path
      ) {

        fs.unlink(
          user.profilePicture.path,
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );

      }

      user.profilePicture = null;

      await user.save();

      res.json({
        message: "Profile picture deleted"
      });

    } catch (err) {

      res.status(500).json({
        error: err.message
      });

    }

  }
);


// GET USER
router.get("/:id", async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;
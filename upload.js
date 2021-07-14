const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");
const path = require("path");
const s3 = require("./filebase");
const fs = require("fs");
//File System
// app.use("/images", express.static(path.join(__dirname, "public/images")));
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "public/images"),
//   filename: (req, file, cb) => {
//     // cb(null, req.body.name);
//     cb(null, Date.now().toString() + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage });

// -- || -- //
// console.log(s3);
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "devchallenges",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // metadata: function (req, file, cb) {
    //   cb(null, Object.assign({}, req.body));
    // },
    key: function (req, file, cb) {
      cb(null, req.body.name);
    },
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype));
    },
    transforms: [
      {
        id: "small",
        key: function (req, file, cb) {
          cb(null, req.body.name.replace(/\.[^/.]+$/, "") + "-500" + ".jpeg");
        },
        transform: function (req, file, cb) {
          cb(
            null,
            sharp()
              .resize({
                fit: sharp.fit.contain,
                width: 500,
              })
              .jpeg({ quality: 90 })
          );
        },
      },
      {
        id: "medium",
        key: function (req, file, cb) {
          cb(null, req.body.name.replace(/\.[^/.]+$/, "") + "-1000" + ".jpeg");
        },
        transform: function (req, file, cb) {
          cb(
            null,
            sharp()
              .resize({
                fit: sharp.fit.contain,
                width: 1000,
              })
              .jpeg({ quality: 90 })
          );
        },
      },
      {
        id: "large",
        key: function (req, file, cb) {
          cb(null, req.body.name.replace(/\.[^/.]+$/, "") + "-1500" + ".jpeg");
        },
        transform: function (req, file, cb) {
          cb(
            null,
            sharp()
              .resize({
                fit: sharp.fit.contain,
                width: 1500,
              })
              .jpeg({ quality: 90 })
          );
        },
      },
    ],
  }),
});

module.exports = upload;

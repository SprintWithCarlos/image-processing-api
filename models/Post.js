const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema(
  {
    title: String,
    images: mongoose.Schema.Types.Mixed,
  },
  {
    collection: "masonryposts",
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);

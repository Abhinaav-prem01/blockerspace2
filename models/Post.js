const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: String,
  username: String,
  content: String,
  likedBy: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", PostSchema);

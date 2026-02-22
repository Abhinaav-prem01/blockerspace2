// backend/models/Post.js
// models/Post.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  content: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },   // 👈 add this
  likedBy: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);

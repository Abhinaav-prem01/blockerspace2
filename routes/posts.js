// routes/posts.js
import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// Create a post
router.post("/", async (req, res) => {
  try {
    const { content, userId, username, email } = req.body;

    const post = await Post.create({
      content,
      userId,
      username,
      email
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create post",
      error: err.message
    });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("createdBy", "username email");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts", error: err.message });
  }
});

// Like a post
router.post("/like/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.likedBy.includes(userId)) post.likedBy.push(userId);
    else post.likedBy = post.likedBy.filter(id => id !== userId);

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to like post", error: err.message });
  }
});

export default router;

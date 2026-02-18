const router = require("express").Router();
const Post = require("../models/Post");

// Create post
router.post("/", async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
});

// Get all posts
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Like post
router.put("/:id/like", async (req, res) => {
  const post = await Post.findById(req.params.id);

  const { email } = req.body;

  if (post.likedBy.includes(email)) {
    post.likedBy = post.likedBy.filter(e => e !== email);
  } else {
    post.likedBy.push(email);
  }

  await post.save();
  res.json(post);
});

module.exports = router;

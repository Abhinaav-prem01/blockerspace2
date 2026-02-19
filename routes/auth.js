const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("./models/User"); // adjust path

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Gmail-only check
  if (!email.toLowerCase().endsWith("@gmail.com")) {
    return res.status(400).json({ message: "Only Gmail accounts are allowed" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Gmail-only check
  if (!email.toLowerCase().endsWith("@gmail.com")) {
    return res.status(400).json({ message: "Only Gmail accounts are allowed" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid email or password" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

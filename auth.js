const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// ✅ POST /api/auth/register – хэрэглэгч бүртгэх
router.post('/register', async (req, res) => {
  try {
    const hashedPwd = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: hashedPwd,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("❌ Register алдаа:", err);
    res.status(500).json({ error: "Бүртгэх үед алдаа гарлаа" });
  }
});

// ✅ POST /api/auth/login – нэвтрэх
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Нууц үг буруу" });

    res.status(200).json({ message: "Амжилттай нэвтэрлээ" });
  } catch (err) {
    console.error("❌ Login алдаа:", err);
    res.status(500).json({ error: "Нэвтрэх үед алдаа гарлаа" });
  }
});

module.exports = router;

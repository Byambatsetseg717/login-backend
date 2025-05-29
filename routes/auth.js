const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Бүртгүүлэх
router.post('/register', async (req, res) => {
  try {
    const hashedPwd = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({ username: req.body.username, password: hashedPwd });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Нэвтрэх
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json("Хэрэглэгч олдсонгүй");

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(401).json("Нууц үг буруу");

    res.status(200).json("Амжилттай нэвтэрлээ");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

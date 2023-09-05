const bcrypt = require("bcrypt");
const express = require("express");
const _ = require("lodash");
const { User, validate } = require("../models/user-model");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send({ message: "User already exists" });
  }

  try {
    user = await User.create(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();
    const token = user.generateAuthToken();
    return res.header("x-auth-token", token).send({
      data: _.pick(user, ["name", "email", "_id"]),
      message: "User created successfully",
    });
  } catch (e) {
    return res.status(500).send({ message: "Something went wrong" });
  }
});

module.exports = router;

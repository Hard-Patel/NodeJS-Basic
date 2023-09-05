const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validateLoginUser } = require("../models/user-model");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({ message: "Invalid username or password" });
  }

  try {
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.send({
        message: "Invalid username or password",
      });
    }
    user.token = user.generateAuthToken();
    return res.send({
      data: _.pick(user, ["name", "email", "_id", "token"]),
      message: "LoggedIn successfully",
    });
  } catch (e) {
    return res.status(500).send({ message: "Something went wrong" });
  }
});

module.exports = router;

const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: {
    type: String,
    minlength: 4,
    maxlength: 255,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, "myPrivateKey");
};

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = {
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(4).max(255).email().required(),
    password: Joi.string().min(3).max(1024).required(),
  };

  return Joi.validate(user, schema);
};

const validateLoginUser = (user) => {
  const schema = {
    email: Joi.string().min(4).max(255).email().required(),
    password: Joi.string().min(3).max(1024).required(),
  };

  return Joi.validate(user, schema);
};

exports.User = User;
exports.validate = validateUser;
exports.validateLoginUser = validateLoginUser;

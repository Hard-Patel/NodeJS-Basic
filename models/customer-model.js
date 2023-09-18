const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 255 },
  isGold: { type: Boolean, default: false },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 3 && v.length < 15;
      },
    },
  },
});

const Customer = mongoose.model("Customer", customerSchema);

const validateCustomer = (customer) => {
  const schema = {
    name: Joi.string().min(2).max(255).required(),
    isGold: Joi.bool().default(false),
    phone: Joi.string().min(3).max(15).required(),
  };

  return Joi.validate(customer, schema);
};

exports.Customer = Customer;
exports.validate = validateCustomer;

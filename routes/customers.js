const express = require("express");
const {auth} = require("../middleware/auth");
const { admin } = require("../middleware/admin");
const {
  Customer,
  validate: validateCustomer,
} = require("../models/customer-model");
const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).send({ message: "Customer doesn't exist" });
    res.send(customer);
  } catch (e) {
    return res.status(404).send({ message: "Customer doesn't exists" });
  }
});

router.post("/", auth, async (req, res) => {
  console.log("req.body: ", req.body);
  const { error } = validateCustomer(req.body);
  if (error) return res.status(401).send({ message: error.details[0].message });

  const customer = await Customer.create({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  try {
    const result = await customer.save();
    res.send({ data: result, message: "Customer added successfully." });
  } catch (e) {
    res.status(400).send({ message: "Something went wrong" });
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(401).send({ message: error.details[0].message });

  try {
    const result = await Customer.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
      {new: true}
    );
    if (!result)
      return res.status(404).send({ message: "Customer doesn't exists" });
    res.send({ data: result, message: "Customer updated successfully" });
  } catch (e) {
    console.log("Error: ", e);
    res.status(404).send({ message: "Customer doesn't exists" });
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const result = await Customer.findByIdAndRemove(req.params.id);
    if (!result) {
      return res
        .status(404)
        .send({ data: {}, message: "Customer doesn't exists" });
    }
    return res.send({ data: result, message: "customer deleted successfully" });
  } catch (e) {
    console.log("-->", e);
    return res.status(404).send({ message: `Customer doesn't exists` });
  }
});

module.exports = router;

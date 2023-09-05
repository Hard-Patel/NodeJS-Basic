const express = require("express");
const { auth } = require("../middleware/auth");
const { admin } = require("../middleware/admin");
const { Genre, validate: validateGenre } = require("../models/genre-model");
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send({ message: "Genre doesn't exist" });
    res.send(genre);
  } catch (e) {
    return res.status(404).send({ message: "Genre doesn't exists" });
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(401).send({ message: error.details[0].message });

  const genre = await Genre.create({
    genre: req.body.genre,
  });

  try {
    const result = await genre.save();
    res.send({ data: result, message: "Genre added successfully." });
  } catch (e) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(401).send({ message: error.details[0].message });

  try {
    const result = await Genre.findByIdAndUpdate(
      req.params.id,
      { genre: req.body.genre },
      {
        new: true,
      }
    );
    if (!result) {
      return res.status(404).send({ message: "Genre doesn't exists" });
    }
    return res.send({ data: result, message: "Genre updated successfully" });
  } catch (e) {
    console.log("Error: ", e);
    return res.status(404).send({ message: "Genre doesn't exists" });
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const result = await Genre.findByIdAndRemove(req.params.id);
    if (!result) {
      return res
        .status(404)
        .send({ data: {}, message: "Genre doesn't exists" });
    }
    return res.send({ data: result, message: "Genre deleted successfully" });
  } catch (e) {
    console.log("-->", e);
    return res.status(404).send({ message: `Genre doesn't exists` });
  }
});

module.exports = router;

const mongoose = require("mongoose");
const morgan = require("morgan");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost/Vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch(() => console.log("Error connecting to the DB"));

app.use(express.json());

app.use(morgan("tiny"));

app.use("/", (req, res) => {
    res.send('Hello world!')  
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

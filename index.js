const mongoose = require("mongoose");
const morgan = require("morgan");
const logger = require("./logger");
const express = require("express");
const genresRouter = require("./routes/genres");
const customerRouter = require("./routes/customers");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const app = express();

mongoose
  .connect("mongodb://localhost/Vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch(() => console.log("Error connecting to the DB"));

app.use(express.json());

// app.use(logger);
app.use(morgan("tiny"));

app.use("/api/genres", genresRouter);
app.use("/api/customers", customerRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

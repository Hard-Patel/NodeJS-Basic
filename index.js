const mongoose = require("mongoose");
const morgan = require("morgan");
const express = require("express");
const app = express();

app.use(express.json());

app.use(morgan("tiny"));

app.use("/", (req, res) => {
    res.send('Hello world!')  
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

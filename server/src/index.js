const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const cors = require('cors');

app.use(express.json());
const corsOption = {
  origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));

app.get("/", (req, res, next) => {
  res.send("Hello world!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
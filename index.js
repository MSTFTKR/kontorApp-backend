const express = require("express");
const dotenv = require("dotenv");
const routes=require('./routes/index')
dotenv.config();
const app = express();
const cors = require("cors");


app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use("/", routes)




app.get("*", (req, res) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

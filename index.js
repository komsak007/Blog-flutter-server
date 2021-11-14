const express = require("express");
const mongoose = require("mongoose");
const Port = process.env.PORT || 5000;
require("dotenv").config();
const app = express();

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDb Connected!");
});

app.use(express.json());

const userRoute = require("./routes/user");
app.use("/user", userRoute);

const profileRoute = require("./routes/profile");
app.use("/profile", profileRoute);

app.route("/").get((req, res) => res.json({ rest: "your first rest api 11" }));

app.listen(Port, () => console.log(`Your server in running on port ${Port}`));

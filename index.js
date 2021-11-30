const express = require("express");
const mongoose = require("mongoose");
const Port = process.env.PORT || 5000;
require("dotenv").config();
const app = express();

mongoose.connect(
  process.env.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, result) => {
    if (err) return console.log(err);

    console.log("Mongodb Connected!");
  }
);

// const connection = mongoose.connection;
// connection.once("open", () => {
//   console.log("MongoDb Connected!");
// });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

const userRoute = require("./routes/user");
app.use("/user", userRoute);

const profileRoute = require("./routes/profile");
app.use("/profile", profileRoute);

const blogRoute = require("./routes/blogpost");
app.use("/blogPost", blogRoute);

app.route("/").get((req, res) => res.json({ rest: "your first rest api 11" }));

app.listen(Port, "0.0.0.0", () =>
  console.log(`Your server in running on port ${Port}`)
);

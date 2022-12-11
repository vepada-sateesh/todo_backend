const express = require("express");
const { TodoRoute } = require("./routes/todo.route");
const { UserRoute } = require("./routes/user.route");
const { connection } = require("./config/db");
require("dotenv").config();
var jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

app.use("/user", UserRoute);

const auth = (req, res, next) => {
    let token = req.headers.authorization
    if (token) {
        try {
            var decoded = jwt.verify(token, 'secret');
            if (decoded) {
                req.body.UserID = decoded.UserID;
                next()
            }
        } catch (error) {
            res.send("please login...")
        }
    }
    else {
        res.send("please login...")
    }
};

app.use(auth)

app.use("/todo", TodoRoute);






app.get("/", (req, res) => {
  res.send("hi iam the home route");
});

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("connection established with mongodb");
  } catch (error) {
    console.log(error.message);
  }
  console.log(`server started running at port ${process.env.port}`);
});

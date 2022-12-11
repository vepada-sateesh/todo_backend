const { application } = require("express");
const express = require("express");
const { UserModel } = require("../models/user.model")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


const UserRoute = express.Router();

UserRoute.post("/signup", async(req, res) => {
    const { email, password } = req.body
    let userPresent = await UserModel.findOne({ email })
    try {
        if (userPresent) {
            res.send("user already exist just login to continue...")
        }
        else {
            bcrypt.hash(password, 4,async function(err, hash) {
                // Store hash in your password DB.
                let user = new UserModel({ email, password: hash })
                await user.save()
                res.send("user registered successfully...")
            });
           // UserModel.insertMany([req.body])
        }
    } catch (error) {
        console.log(err.message);
    }
})

UserRoute.post("/login", async (req, res) => {
    const { email, password } = req.body
    let findUser_exist = await UserModel.find({ email })
    if (findUser_exist.length > 0) {
        try {
            let hashed_pass_inDB = findUser_exist[0].password;
            bcrypt.compare(password, hashed_pass_inDB, async function (err, result) {
                console.log(result,"result")
                // result == true
                if (result) {
                    var token = jwt.sign({ "UserID": findUser_exist[0]._id }, 'secret');
                    res.send({"message":"login successfully","token":token})
                }
                else {
                    res.send("please enter right credintials..")
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    }
    else {
        res.send({ "message": "please enter valid details" });
    }
})





module.exports = { UserRoute };

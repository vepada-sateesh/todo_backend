const express = require("express");
const {TodoModel} = require("../models/todo.model")
const TodoRoute = express.Router();
var jwt = require('jsonwebtoken');

TodoRoute.get("/mytodos", async (req, res) => {

    let token = req.headers.authorization
    //console.log(token)
    const decoded = jwt.verify(token, 'secret')
    //console.log(decoded,"deco")
    if (decoded) {
            //console.log(decoded,"deco")
            const userID = decoded.UserID
            //console.log(userID,"see it")
            const todos = await TodoModel.find({ UserID: userID })
            res.send({"todos":todos})
        }
        else {
            res.send("not authorised")
        }
})

TodoRoute.post("/create", async (req, res) => {
    const payload = req.body;
    console.log(payload)
    try {
        const new_todo = TodoModel(payload)
        await new_todo.save()
        res.send("todo created successfully...")
    } catch (error) {
        console.log(error.message);
        res.send({"err":"something went wrong try again"})
    }
})

TodoRoute.patch("/update/:todoID", async (req, res) => {
    let id = req.params.todoID
    let IDuser = req.body.UserID;

    let payload = req.body;
    try {
        let note = await TodoModel.find({ _id: id })
        console.log(IDuser,note[0].UserID);
        if (IDuser !== note[0].UserID) {
            res.send("your are not authorised to do this")
        } else {
            await TodoModel.findByIdAndUpdate({ _id: id }, payload)
            res.send({"mesg":"updated.."})
        }
    } catch (error) {
        console.log(error.message);
        res.send({"error":"something went wrong please try agin.."})
    }
})
TodoRoute.delete("/delete/:todoID", async (req, res) => {
    console.log("enter")
    let id = req.params.todoID
    let IDuser = req.body.UserID;

   
    try {
        let note = await TodoModel.find({ _id: id })
       // console.log(IDuser,note[0].UserID);
        if (IDuser !== note[0].UserID) {
            res.send("your are not authorised to do this")
        } else {
            await TodoModel.findByIdAndDelete({ _id: id })
            res.send({"mesg":"deleted successfully.."})
        }
    } catch (error) {
        console.log(error.message);
        res.send({"error":"something went wrong please try agin.."})
    }
})





module.exports = { TodoRoute };

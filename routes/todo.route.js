const express = require("express");
const {TodoModel} = require("../models/todo.model")
const TodoRoute = express.Router();

TodoRoute.get("/mytodos", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1]
    
        const decoded = jwt.verify(token, 'hush')
        if(decoded){
            const userID = decoded.userID
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

TodoRoute.patch("/create/:todoID", async (req, res) => {
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
TodoRoute.delete("/create/:todoID", async (req, res) => {
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

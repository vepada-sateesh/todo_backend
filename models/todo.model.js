const mongoose = require("mongoose");

//schema
const TodoSchema = mongoose.Schema({
  title: String,
  notes: String,
  UserID:String
});

//model
const TodoModel = mongoose.model("todos", TodoSchema);

module.exports = { TodoModel };

const mongoose = require("mongoose");

//schema
const TodoSchema = mongoose.Schema({
  email: {type:String,required:true},
  password: {type:String,required:true}
});

//model
const UserModel = mongoose.model("Users", TodoSchema);

module.exports = { UserModel };

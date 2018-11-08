const mongoose = require("mongoose");
//change to array
const commentSchema = new mongoose.Schema({
  text: { type: String },
  author: { type: String }
});

//{ type: mongoose.Schema.Types.ObjectId, ref: "User" }

commentSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model("Comment", commentSchema);

// Books.findById(id).populate("nuggets").populate("author")

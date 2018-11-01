const mongoose = require("mongoose");
//change to array
const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String /*, unique: true */ },
  author: { type: String /*, unique: true */ }
});

commentSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model("Comment", commentSchema);

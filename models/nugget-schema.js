const mongoose = require("mongoose");
//change to array
const nuggetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true /*, unique: true */ },
  fromPage: { type: String, required: true /*, unique: true */ },
  toPage: { type: String, required: true /*, unique: true */ },
  description: { type: String }
});

nuggetSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model("Nugget", nuggetSchema);

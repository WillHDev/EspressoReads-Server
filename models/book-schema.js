const mongoose = require("mongoose");
//change to array
const bookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  subtitle: { type: String },
  description: String,
  tags: [{ name: String, id: String }],
  nuggets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Nugget" }],
  authors: String,
  image: String,
  Url: String,
  votes: Number,
  podcasts: [
    {
      name: String,
      episode: Number,
      segment: [
        {
          start: String
        }
      ]
    }
  ]
});

bookSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model("Books", bookSchema);

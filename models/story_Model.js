const mongoose = require('mongoose');

const storySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  story: String,
  caption:String,
  date: {
    type: Date,
    default: Date.now
  }
})


module.exports = mongoose.model("story", storySchema);
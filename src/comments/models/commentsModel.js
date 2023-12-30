const { Schema, default: mongoose } = require("mongoose");

const CommentsModel = Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  comment: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Comments", CommentsModel);

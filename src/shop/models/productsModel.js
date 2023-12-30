const { default: mongoose, Schema } = require("mongoose");

const productSchema = mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  sale_price: {
    type: Number,
    required: false,
    min: 0,
  },
  quantity_in_stock: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },


  rate: {
    type: Number,
    required: false,
    min: 0,
    max: 5,
  },
  added_date: {
    type: Date,
    default: Date.now,
  },

  category: [
    {
      type: Schema.Types.String,
      // ref: "Product Category",
      // required: true,
    },
  ],

  image: {
    type: Schema.Types.ObjectId,
    ref: "Uploaded Images",
  },
});

module.exports = mongoose.model("Products", productSchema);

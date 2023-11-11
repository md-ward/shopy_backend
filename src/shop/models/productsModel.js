const { default: mongoose } = require("mongoose");

const productSchema = mongoose.Schema({
  product_name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  rate: {
    type: Number,
    required: false,
    min: 0,
    max: 5
  },
  added_date: {
    type: Date,
    default: Date.now
  },
  product_type: {
    type: String,
    required: true,
    ref: 'Product Category'
  },
  images: {
    type: [{
      data: Buffer,
      contentType: String
    }],
    required: false
  }

});

module.exports = mongoose.model('Products', productSchema);
const { Schema, default: mongoose } = require("mongoose");

const product_Category_Schema = Schema({
    product_Category: {
        type: Schema.Types.String
        ,
        required: false
    }



})

module.exports = mongoose.model('Product Category', product_Category_Schema);
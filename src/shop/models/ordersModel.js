const { Schema, default: mongoose } = require("mongoose");

const orderSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        type: Schema.Types.Map,
        ref: 'Product',
        required: true
    }],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true,
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);


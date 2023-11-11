const { default: mongoose, Schema } = require("mongoose");


const contactusSheam = Schema({
    user_name: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true
    },
    message: {
        type: Schema.Types.String,
        required: true
    },
    created_at: {
        type: Schema.Types.Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ContactUs', contactusSheam);
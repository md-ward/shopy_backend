const { Schema, default: mongoose } = require("mongoose");

const AdminModel = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    adminToken: {
        type: String,
        default: null
    },

    resetPasswordPin: {
        passwordResetToken:{
type:String
,default:null
        },
        pinCode: {
            type: String,
            default: null,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Admin', AdminModel)
const { Schema, model, default: mongoose } = require("mongoose");

const ImageSchema = new Schema({
    image_alt: { type: String, require: false },
    originalUrl: {type:String,require:true},
    thumbnailUrl: {type:String,require:true},
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Uploaded Images',ImageSchema);

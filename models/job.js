var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
    data: Buffer,
    contentType: String,
})

var jobSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.ObjectId, ref: 'user' },
    name: String,
    share: Boolean,
    visible: Boolean,
    images: [imageSchema],
    time: Date
});

module.exports = mongoose.model('Job', jobSchema);
var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
    data: Buffer,
    contentType: String,
})

var jobSchema = mongoose.Schema({
    id: String,
    user_id: String,
    name: String,
    share: Boolean,
    visible: Boolean,
    images: [imageSchema],
    time: Date
});

module.exports = mongoose.model('Job', jobSchema);
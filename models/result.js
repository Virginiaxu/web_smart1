var mongoose = require('mongoose');

var resultSchema = mongoose.Schema({
    id: String,
    user_id: String,
    content: { data: Buffer, contentType: String},
    time: Date
});

module.exports = mongoose.model('Job', jobSchema);
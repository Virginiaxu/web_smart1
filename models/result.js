var mongoose = require('mongoose');

var resultSchema = mongoose.Schema({
    job_id: { type: mongoose.Schema.ObjectId, ref: 'job' },
    user_id: { type: mongoose.Schema.ObjectId, ref: 'user' },
    content: { data: Buffer, contentType: String},
    time: Date
});

module.exports = mongoose.model('Job', jobSchema);
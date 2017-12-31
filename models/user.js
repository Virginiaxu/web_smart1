var mongoose = require('mongoose');

/*var userSchema = mongoose.Schema({
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }

}); */

var userSchema = mongoose.Schema({
    email: { type: String, unique: true },

    facebook: String,
    twitter: String,
    google: String,

    tokens: Array,
    profile:
    {
        name: String,
        picture: String,
        location: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

let AuthSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
let AuthModel = mongoose.model('auths', AuthSchema);

module.exports = AuthModel;
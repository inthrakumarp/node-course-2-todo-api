const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim:true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
}
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    
    var access = "Auth";
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'secretPassword').toString();
    
    user.tokens.push({access, token} );
    
    // retun user.save... - return is used here to pass on the token value to the next chaining promise where the generateAuthToken function is called
    return user.save().then(() => {
        return token;
    })
}
var User = mongoose.model('Users', UserSchema);

module.exports = {User};
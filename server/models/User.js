const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

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
    
    var access = 'Auth';
    var token = jwt.sign({_id: user._id.toHexString(), access: 'Auth'}, 'secretPassword').toString();
    
    user.tokens.push({access, token} );
    
    // retun user.save... - return is used here to pass on the token value to the next chaining promise where the generateAuthToken function is called
    return user.save().then(() => {
        // console.log(token);
        return token;
    })
}

UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;
        
    try{
        decoded = jwt.verify(token, 'secretPassword');
    } catch(e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // })
        // console.log(e);
        return Promise.reject(); 
        // this single stmt is equvalent to the above commented 3 lines
    }
    
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'Auth'
    });
}

UserSchema.pre('save', function(next) {
    var user = this;
    
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else { 
      next();  
    }
})

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    
    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }
        
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user);
                } else {
                    reject();
                }
                
            })
        })
    })
}

var User = mongoose.model('Users', UserSchema);

module.exports = {User};
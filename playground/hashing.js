const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = "123abc!";
var hashed = "";

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
        hashed = hash;
        bcrypt.compare(password, hash, (err, res) => {
            console.log(res);
        })
    } )
})

bcrypt.compare(password, hashed, (err, res) => {
    console.log(res);
})
// var data = {
//     id: 11
// };
// var token = jwt.sign(data, 'secretPassword');
// var decoded = JSON.stringify(jwt.verify(token, 'secretPassword'));

// console.log(`token: ${token}`);
// console.log(`decoded: ${decoded}`);


// var message = 'I am inthrakumar';
// var hash = SHA256(message);

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'secretPassword').toString() 
// }


// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(data) ).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'secretPassword').toString();
// if(resultHash === token.hash){
//     console.log('Data was not changed');
// } else {
//     console.log('Data has been changed, do not trust');
// }
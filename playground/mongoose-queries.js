const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/User');

var id = "58acc76515975dae473f9921";

// if(!ObjectID.isValid(id)){
//     return console.log("ID is not valid");
// }

// Todo.find({
//     _id: id 
// }).then((todos) => {
//     console.log("Todos : ", todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log("Todo : ", todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo){
//         return console.log("Todo not found");
//     }
//     console.log("Todo by Id", todo);
// });

User.find().then((users) => {
    console.log("Users : ", users);
});

User.findOne({
    _id: id
}).then((user) => {
    console.log("USer", user);
});

User.findById(id).then((user) => {
    if(!user){
        return console.log("Cannot find the user ")
    }
    console.log("User find by ID", user);
})
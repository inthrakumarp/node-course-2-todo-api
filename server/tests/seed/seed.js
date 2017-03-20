const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/Todo');
const {User} = require('./../../models/User');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
 _id: userOneId,
 email: 'inthrakumar@gmail.com',
 password: 'secretPassword',
 tokens: [{access: 'Auth',
        token: jwt.sign({_id: userOneId.toHexString(), access: 'Auth'}, 'secretPassword').toString()
         }]   
}, {
    _id: userTwoId,
    email: 'bannie.15@gmail.com',
    password: 'userTwoPass'
}]

const todoArr = [{
    _id: new ObjectID(),
    text: "First test todo"
}, {
    _id: new ObjectID(),
    text: "Second test todo",
    completed: true,
    completedAt: 555
}];

const populateTodos = (done) => {
    Todo.remove().then(() => {
        return Todo.insertMany(todoArr);
    }).then(done());
};

const populateUSers = (done) => {
    User.remove().then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        
        return Promise.all([userOne, userTwo])
    }).then(done());
}
module.exports = {todoArr, populateTodos, users, populateUSers};
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/Todo');
var {User} = require('./models/User');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    // res.send(req.body);
    // next();
    var newTodo = new Todo({
        text: req.body.text
    });
    
    newTodo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        //console.log("Unable to create Todo");
        res.status(400).send(e);
    })
})

app.listen(3000, () => {
    console.log("Server has started listening @ :3000");
})
// var newTodo = new Todo({
//     text: "Learn Jquery",
//     completed: true,
//     completedAt: 15-05-2016
// });

// var newUser = new User({
//    email: '    inthra    '
// });

// newTodo.save().then((doc) =>{
//     console.log(doc);    
// }, (e) => {
//     console.log("Unable to connect");
// })

// newUser.save().then((doc) => {
//     console.log(doc);
// }, (e) => {
//     console.log("Unable to create user", e);
// })

module.exports = {app};
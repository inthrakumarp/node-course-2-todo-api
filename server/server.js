var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/Todo');
var {User} = require('./models/User');
var {ObjectID} = require('mongodb');

var app = express();
CONST port = process.env.PORT || 3000;

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

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
})

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    
    if(!ObjectID.isValid(id)){
        res.status(404).send();
    }
    
    Todo.findById(id).then((todo) => {
        if(!todo){
            res.status(404).send();
        }
        
        res.send({todo});
    }, (e) => {
        res.status(400).send(e);
    })
})
app.listen(port, () => {
    console.log(`Server has started listening @ : ${port}`);
})
// var newTodo = new Todo({
//     text: "Learn Jquery",
//        completed: true,
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
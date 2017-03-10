require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/Todo');
var {User} = require('./models/User');

const port = process.env.PORT;
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

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    
    if(!ObjectID.isValid){
        res.status(404).send();
    }
    
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            res.status(400).send()
        } 
        
         res.status(200).send({todo});
        
    }, (e) => {
        res.status(404).send(e);
    })
})


app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    
    var body = _.pick(req.body, ['text', 'completed']);
    
    if(!ObjectID.isValid){
        res.status(404).send();
    }
    
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }
    
    Todo.findByIdAndUpdate(id, {$set: body}, {new:true}).then((todo) => {
        if(!todo){
            res.status(404).send();
        }
        
        res.status(200).send({todo});
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    
    var newUser = new User(body);     
    
    newUser.save().then(() => {
        // res.send(doc);
        return newUser.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(newUser);  
    }).catch((e) => {
        res.status(400).send(e);
    })
});

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
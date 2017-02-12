// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, objectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if(err){
        return console.log("Unable to connect to MongoDB");
    }
    
    console.log("Connected to MongoDB");  
    
    // db.collection("Todos").insertOne({
    //     text: 'Learn Mongo DB',
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log("Unable to insert todo item", err);
    //     }
        
    //     console.log("todo item inserted");
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })
    
    db.collection("Users").insertOne({
        name: 'Rathi',
        age: 40,
        location: 'London'
    }, (err, result) => {
        if(err){
            return console.log("Unable to insert user document");
        }
        
        console.log(JSON.stringify(result.ops, undefined, 2));
    })
    
    db.close();
});
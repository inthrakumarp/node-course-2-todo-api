// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, objectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if(err){
        return console.log("Unable to connect to MongoDB");
    }
    
    console.log("Connected to MongoDB");
    
    // db.collection("Users").find().toArray().then((docs) => {
    //     console.log(JSON.stringify(docs, undefined, 2));
    // });
    
    db.collection("Users").find().count().then((count) => {
        console.log(`Todos : ${count}`);
    })
    db.collection("Users").find({location: 'Chennai'}).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    })
    db.close();
});
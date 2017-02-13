// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if(err){
        return console.log("Unable to connect to MongoDB");
    }
    
    console.log("Connected to MongoDB");
    
    // db.collection("Users").find().toArray().then((docs) => {
    //     console.log(JSON.stringify(docs, undefined, 2));
    // });
    
    // db.collection("Users").deleteMany({name: 'Inthrakumar'}).then((result) => {
    //     console.log(result);
    // })
    
    // db.collection("Users").deleteOne({age:31}).then((result) => {
    //     console.log(result);
    // })
    
    // db.collection("Users").findOneAndDelete({location: 'Cardiff'}).then((result) => {
    //     console.log(result);
    // })
    
    db.collection("Users").findOneAndDelete({_id: new ObjectID("58a02d05df80f734a418d8e3")}).then((result) => {
        console.log(result);
    })
    // db.close();
});
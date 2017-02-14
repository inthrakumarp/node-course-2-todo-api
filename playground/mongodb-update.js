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
    
    // db.collection("Users").findAndModify(
    //      {name: 'Kaniksha'},
    //      [],
    //      {$set :{
    //         name: 'Samiksha',
    //         age: 2
    //         }
    //     },
    //     {new: true}
    // ).then((result) => {
    //     console.log(result);
    // });
    
    db.collection("Users").findAndModify(
        {_id : new ObjectID("58a02cdd3bd86b0e90497a43")},
        {$set : {
            name: 'Kaniksha',
            age: 5
            }
        },
        {new: true}
    ).then( (result) => {
        console.log(result);
    })
    
    // db.close();
});
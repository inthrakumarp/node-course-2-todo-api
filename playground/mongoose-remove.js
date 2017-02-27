const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/USer');

// Todo.remove({}).then((result) => {
//     console.log(result);
// })

// Todo.findOneAndRemove({_id: '58b3549472ade24a066b31a7'}).then((res) => {
//     console.log(res);
// })

Todo.findByIdAndRemove('58b4a34ff840711cc4a24002').then((res) => {
    console.log(res);
})
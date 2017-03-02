const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');


const todoArr = [{
    _id: new ObjectID(),
    text: "First test todo"
}, {
    _id: new ObjectID(),
    text: "Second test todo",
    completed: true,
    completedAt: 555
}];

beforeEach((done) => {
    Todo.remove().then(() => {
        return Todo.insertMany(todoArr);
    }).then(done());
});

describe("POST /todos", () => {
    it("Should create a new todo", (done) => {
        var text = "Create a test todo";
        
        request(app)
        .post("/todos")
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
        })
    })
    
    it("Should not create a wrong todo", (done) => {
        var text = "";
        
        request(app)
        .post("/todos")
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err);
            }
            
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        })
    })
})

describe("GET /todos", () => {
    it("Should get all the todos", (done) => {
        request(app)
            .get("/todos")
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done);
        })
    });
    
describe("GET /todos/:id", () => {
    it("Should return a todo", (done) => {
        request(app)
            .get(`/todos/${todoArr[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todoArr[0].text);
            })
            .end(done);
        });
        
    it("Should return 404 if todo not found", (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
             .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });
    
    it("Should return 404 for non-object IDs", (done) => {
        request(app)
            .get("/todos/123")
            .expect(404)
            .end(done);
    });
    
    }); 
    
    describe("Delete /todos:id", () => {
        it("Should delete a todo", (done) => {
            var hexId = todoArr[1]._id.toHexString();
            
            request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            })
        })
        
        it("Should return 400 if todo not found", (done) => {
            request(app)
            .delete('/todos/58b4a34ff840711cc4a24002')
            .expect(400)
            .end(done);
        })
        
        it("Should return 404 for non-objectIDs", (done) => {
            request(app)
            .delete('/todos/123cc')
            .expect(404)
            .end(done);
        })
    })
    
    describe("Patch todos/id", () => {
        it("Should update the todo", (done) => {
            var hexId = todoArr[1]._id.toHexString();
            var newText = 'testing patch todo';
            
            request(app)
            .patch(`/todos/${hexId}`)
            .send({text: newText,completed: todoArr[1].completed})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo).toInclude({text: newText, completed: true});
                expect(res.body.todo.completedAt).toBeA('number');
            }).end((err, res) => {
                if(err){
                    return done(err);
                }
                
                Todo.findById(hexId).then((todo) => {
                    if(todo){
                        done();
                    }
                }).catch((e) => done(e));
            });
            
        });
        
        it("Should clear completedAt if the todo is not completed", (done) => {
            var hexId = todoArr[1]._id.toHexString();
            var newText = "Patch testing";
            
            request(app)
            .patch(`/todos/${hexId}`)
            .send({text: newText, completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo).toInclude({text: newText, completed: false});
                expect(res.body.todo.completedAt).toBe(null);
            }).end((err, res) => {
                if(err){
                    return done(err);
                }
                
                Todo.findById(hexId).then((todo) => {
                    if(todo){
                        done();
                    }
                }).catch((e) => done(e));
            })
        })
    })
    
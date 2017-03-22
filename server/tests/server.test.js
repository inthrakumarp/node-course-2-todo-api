const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');
const {User} = require('./../models/User');
const {todoArr, populateTodos, users, populateUSers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUSers);

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
    
    describe('GET /users/me', () => {
        it('Should return a user if authenticated', (done) => {
            request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            }).end((err) => {
                if(err){
                    return done(err);
                }
                
            });
        });
        
        it('should return 401 if not authenticated', (done) => {
            request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            }).end(done);
        })
    });
    
    describe('POST /users', () => {
        it('Should create a user', (done)=> {
            var email = "test@test.com";
        var password = "testpass";
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.header['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if(err){
                return done(err);
            }
            
            User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            }).catch((e) => done(e));
        });
        });
        
        it('Should return validation errors if request invalid', (done) => {
            var email = "test";
            var password = "a";
            
            request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            // .expect((res) => {
            //     expect(res.body).toEqual({});
            .end(done);
        })
        
        it('Should not create user if email in use', (done) => {
            var email = "inthrakumar@gmail.com";
            var password = "testpass";
            
            request(app)
            .post('/users')
            .send({email, password})
            .expect(400);
            done();
        })
    });
    
    describe('POST /users/login', () => {
        it('Should login user and return auth token', (done) => {
            request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist();
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'Auth',
                        token: res.header['x-auth']
                    })
                    done();
                }).catch((e) => done(e));
            })
        });
        
        it('Should reject invalid login', (done) => {
            request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'test'
            })
            .expect(400)
            .expect((res) => {
                expect(res.header['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
        })
    })
    
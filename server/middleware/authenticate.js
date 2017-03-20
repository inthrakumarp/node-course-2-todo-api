const {User} = require('./../models/User');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    
    User.findByToken(token).then((user) => {
         console.log(token);
         console.log(user);
        if(!user){
            return Promise.reject();    
            // res.status(400).send();  
        }
        
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        // console.log(e);
        res.status(401).send();
    })
}

module.exports = {authenticate};
const errors = require('restify-errors');

const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../auth');
const config = require('../config');

module.exports = server => {
    // register user

    server.post('/register', (req, res, next) => {
        // check for json
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json"));
        }

        const {email, password } = req.body;

        const user = new User({
            email: email,
            password: password
        });

        bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(user.password, salt,async (err, hash)=> {
                // hash password
                user.password = hash;
                // save the user
                try {
                    const newUser = await user.save();
                    res.send(201);
                    next();
                }
                catch(err){
                    return next(new errors.InternalError(err.message));
                }
            })
        })
    });

server.post('/auth', async (req,res,next) => {
    const {email, password } = req.body;
    try {
        // Authenticate the user
        const user = await auth.authenticate(email, password);
        console.log(user);

        // create token 
        const token = jwt.sign(user.toJSON(),config.JWT_SECRET, {
            expiresIn: '15m'
        });

        const {iat, exp} = jwt.decode(token);

        // respond with token 
        res.send({iat, exp, token});
        next();
    }
    catch(err){
        // user un-authorized
        return next(new errors.UnauthorizedError(err));
    }
})
};


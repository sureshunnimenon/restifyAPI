const errors = require('restify-errors');
const Customer = require('../models/Customer');

module.exports = server => {
    //get customers 
    server.get('/customers', async (req,res,next) => {
        // res.send({msg: 'test'});
        // get all customers 
        try{
            const customers = await Customer.find({});
            res.send(customers);
            next();
        }

        catch(err){
            return next(new errors.InvalidContentError(err));
        }       
    });

    //get a single customer
    server.get('/customers/:id', async (req,res,next) => {
        // res.send({msg: 'test'});
        // get all customers 
        try{
            const customer = await Customer.findById(req.params.id);
            res.send(customer);
            next();
        }

        catch(err){
            return next(new errors.ResourceNotFoundError(`Not found such customer ${req.params.id}`));
        }       
    });
     

    // create/add customers
    server.post('/customers', async (req,res, next) => {
        // check for json
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json"));
        }
        const {name, email, balance} = req.body;
        const customer = new Customer({
            name: name,
            email: email,
            balance: balance
        });

        try {
            const newCustomer = await customer.save();
            res.send(201);
            next();
        } 
        catch(err){
            return next(new errors.InternalError(err.message));
        }
    });

    // update customer
        server.put('/customers/:id', async (req,res, next) => {
        // check for json
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json"));
        }
        

        try {
            const customer = await Customer.findOneAndUpdate({_id: req.params.id}, req.body);
            res.send(200);
            next();
        } 
        catch(err){
            return next(new errors.ResourceNotFoundError(`Not found such customer ${req.params.id}`));
        }
    });

    // delete customer
    // added a comment
    server.del('/customers/:id', async (req,res,next) => {
        try {
            const customer = await Customer.findOneAndRemove({_id: req.params.id});
            res.send(204);
            next();
        }
        catch(err){
            return next(new errors.ResourceNotFoundError(`Not found such customer ${req.params.id}`));

        }
    })
    
};
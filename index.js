const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');

const server = restify.createServer();

// middleware

server.use(restify.plugins.bodyParser());

server.listen(config.PORT, () => {
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true});
});

const db = mongoose.connection;

db.on('error', (err) => console.log(err));

db.once('open', ()=> {
    require('./routes/customers')(server);
    console.log(`server stsrted on port ${config.PORT}`);
})


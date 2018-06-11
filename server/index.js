const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
const port = 1337;
const session = require('express-session')

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../build` ) );

const createInitialSession = require('./middlewares/session');
const filter = require('./middlewares/filter');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 10000}
}))

app.use(createInitialSession);

app.use((req, res, next) => {
    const {method} = req;

    if(method === 'POST' || method === 'PUT'){
        filter(req, res, next)
    }else{
        next();
    }
})


app.post( "/api/messages", mc.create );
app.get( "/api/messages", mc.read );
app.put( "/api/messages", mc.update );
app.delete( "/api/messages", mc.delete );
app.get('/api/messages/history', mc.history)


app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );
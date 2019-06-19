const express = require('express');
const database = require('./controllers/database');
const session = require('express-session');


const app = express();

app.set('view engine', 'ejs');		//Setting view engine

app.use('/assets', express.static('static'));		//middleware

//use sessions for tracking logins
app.use(session({
  secret: 'switchon assignment',
  resave: true,
  saveUninitialized: false
}));

//fire controller
database(app);



const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Yo dawgs, you are listening to port ${port}`);

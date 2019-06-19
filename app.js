const express = require('express');
const database = require('./controllers/database');

const app = express();

app.set('view engine', 'ejs');		//Setting view engine

app.use('/assets', express.static('static'));		//middleware

//fire controller
database(app);



const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Yo dawgs, you are listening to port ${port}`);

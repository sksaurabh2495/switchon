var express = require('express');

var app = express();

app.get('/', function(request, response){
    response.send('This is the HomePage');
});

app.get('/contact', function(request, response){
    response.send('This is the Contact Page');
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Yo dawgs, you are listening to port ${port}`);

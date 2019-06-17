var http = require('http');
var fs = require('fs');


var server = http.createServer(function(request,response){
    console.log('Request was made : ' + request.url);
    response.writeHead(200, {'Content-Type' : 'application/json'});
    var myObj = {
        name : 'Ryu',
        job : 'Ninja',
        age : 24
    };
    response.end(JSON.stringify(myObj));
});

server.listen(3000, '3.16.161.74');

console.log('Yo dawgs, you are listening to port 3000');

const mongoose = require('mongoose');
const parser = require('body-parser');

mongoose.set('useFindAndModify', false);
const mongoUrl = 'mongodb://admin:admin@cluster0-shard-00-00-ryrmi.mongodb.net:27017,cluster0-shard-00-01-ryrmi.mongodb.net:27017,cluster0-shard-00-02-ryrmi.mongodb.net:27017/switchon?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
const opts = { useNewUrlParser: true};

createConnection();

async function createConnection() {
    await mongoose.connect(mongoUrl, opts)
        .then(res => console.log("Connected to Database"))
        .catch(function (reason) {
        console.log('Unable to connect to the mongodb instance. Error: ', reason);
    });
}

const conn = mongoose.connection;
const Schema = mongoose.Schema;

const schema = new Schema({
    name: String
});

const userModel = mongoose.model('users', schema);
var instance = new userModel();

instance.name = 'Saurabh Kumar';
instance.save(function (err) {
    if (err) throw err;
    console.log('Item saved.');
});

userModel.find({}, function (err, docs) {
    console.log(docs);
});

var data = [{item: 'get milk'},{item: 'walk dog'},{item: 'kick some coding ass'}];
var urlencodedParser = parser.urlencoded({extended: false});

module.exports = function(app){

    // app.get('/todo', function(request, response){
    //     response.render('todo', {todos: data});
    // });

    // app.post('/todo', urlencodedParser, function(request, response){
    //     data.push(request.body);
    //     response.json(data);
    // });

    app.get('/', function (request, response){
        response.send('This is the HomePage');
    });


    app.get('/switchon/login', isLoggedIn, function (request, response){
        response.render('home');
    });

    app.get('/switchon/signup', function (request, response){
        response.render('signup');
    });

    app.get('/switchon', isLoggedIn, function (request, response){
        response.render('home');
    });

    app.get('/switchon/contact', function (request, response){
        var data = {age: 23, job: 'Developer', hobbies: ['Eating', 'Sleeping', 'Fishing']};
        response.render('contact');
        //response.render('contact', {person: request.params.name , data: data});
    });

    app.post('/switchon/signin', urlencodedParser, function (request, response){
        console.log(request.body);
        response.render('home');
    });

    app.get('/switchon/logout', function (request, response) {
        if(request.session){
            request.session.username = null;
            request.session.userid = null;
            request.session.department = null;
            request.session.departmentid = null;
        }
        response.render('login');
    });

    function isLoggedIn (request, response, next) {
        if (!(request.session && request.session.username && request.session.userid && request.session.department && request.session.departmentid)) {
            response.render('login');
        }
        else{
            next();
        }
    }

};

const mongoose = require('mongoose');
const parser = require('body-parser');
const hash = require('password-hash');

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
    id: Number,
    name: String,
    email: String,
    departmentId: Number,
    departmentName: String,
    password: String
});

const deptschema = new Schema({
    id: Number,
    name: String
});

const countschema = new Schema({
    name: String,
    counter: Number
});

const userModel = mongoose.model('users', schema);
const deptModel = mongoose.model('departments', deptschema);
const counterModel = mongoose.model('counters', countschema);
var instance = new userModel();


var data = [{item: 'get milk'},{item: 'walk dog'},{item: 'kick some coding ass'}];
var urlencodedParser = parser.urlencoded({extended: false});

module.exports = function(app){

    // app.post('/todo', urlencodedParser, function(request, response){
    //     data.push(request.body);
    //     response.json(data);
    // });

    app.get('/', function (request, response){
        response.send('This is the HomePage');
    });

    app.get('/switchon', isLoggedIn, function (request, response){
        response.render('home', {userData: request.session});
    });

    app.get('/switchon/login', isLoggedIn, function (request, response){
        response.render('home', {userData: request.session});
    });

    app.post('/switchon/login', urlencodedParser, function (request, response){

        userModel.find({email: request.body.email}, function (err, docs) {
            //if (err) throw err;
            if(docs.length == 0){
                response.render('login', {message: 'User is not Registered'});   //user does not exist
            }
            else{
                for(var i = 0 ; i < docs.length ; i++){
                    if(hash.verify(request.body.password, docs[i].password)){
                        //password matches
                        request.session._switchon_id = docs[i].id;
                        request.session._switchon_email = docs[i].email;
                        request.session._switchon_name = docs[i].name;
                        request.session._switchon_departmentId = docs[i].departmentId;
                        request.session._switchon_departmentName = docs[i].departmentName;

                        request.session.save(function (err) {
                            response.redirect('/switchon');
                        });
                        break;
                    }
                    if(i == docs.length - 1){
                        response.render('login', {message: 'Incorrect Password'});   //incorrect password
                    }
                }
            }
        });
    });

    app.get('/switchon/signup', function (request, response){
        deptModel.find({}, function (err, docs) {
            if(request.session){
                request.session.destroy();
            }
            response.render('signup', {departments: docs});
        });
    });

    app.post('/switchon/signup', urlencodedParser, function (request, response){
        
        instance.name = request.body.name;
        instance.email = request.body.email;
        instance.departmentId = request.body.department;
        instance.password = hash.generate(request.body.password);

        deptModel.find({id: instance.departmentId}, function (err, docs) {
            
            instance.departmentName = docs[0].name;
            counterModel.findOneAndUpdate({name: 'users'}, {$inc:{counter:1}}, function (err, docscount) {
                
                instance.id = docscount.counter;
                instance.save(function (err) {
                    //if (err) throw err;
                    if (err) response.redirect('/switchon/signup');
                    request.session._switchon_id = instance.id;
                    request.session._switchon_email = instance.email;
                    request.session._switchon_name = instance.name;
                    request.session._switchon_departmentId = instance.departmentId;
                    request.session._switchon_departmentName = instance.departmentName;

                    request.session.save(function (err) {
                        response.redirect('/switchon');
                    });
                    
                });
            });

        });
        
    });

    app.get('/switchon/logout', function (request, response) {
        if(request.session){
            request.session.destroy(function(err) {
                if(err) {
                    return next(err);
                } else {
                    response.redirect('/switchon/login');
                }
            });
        }
    });

    function isLoggedIn (request, response, next) {
        if (!(request.session && request.session._switchon_id && request.session._switchon_email && request.session._switchon_name)) {
            response.render('login');
        }
        else{
            next();
        }
    }

};


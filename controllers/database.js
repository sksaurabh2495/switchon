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

const requestschema = new Schema({
    id: Number,
    status: Number,             //  -1: rejected, 0: accepted, 1: pending
    fromUid: Number,
    toUid: Number,
    fromDept: Number,
    toDept: Number,
    message: String,
    fromUser: String,
    toUser: String,
    fromDeptName: String,
    toDeptName: String
});

const userModel = mongoose.model('users', schema);
const deptModel = mongoose.model('departments', deptschema);
const counterModel = mongoose.model('counters', countschema);
const requestModel = mongoose.model('requests', requestschema);

var urlencodedParser = parser.urlencoded({extended: false});

module.exports = function(app){

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
        
        var instance = new userModel();
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

    app.get('/switchon/dept', function (request, response){
        var data = {code: -111};
        deptModel.find({}, function (err, docs) {
            if(!err){
                data.code = 555;
                data.data = docs;
            }
            response.end(JSON.stringify(data));
        });
    });

    app.get('/switchon/user', function (request, response){
        var data = {code: -111};
        userModel.find({departmentId: request.query.id}, function (err, docs) {
            if(!err){
                data.code = 555;
                data.data = docs;
            }
            response.end(JSON.stringify(data));
        });
    });

    app.post('/switchon/request', urlencodedParser, function (request, response){
        var data = {code: -111};
        counterModel.findOneAndUpdate({name: 'requests'}, {$inc:{counter:1}}, function (err, docscount) {

            var req_instance = new requestModel();
            req_instance.id = docscount.counter;
            req_instance.fromUid = request.body.my_uid;
            req_instance.toUid = request.body.uid;
            req_instance.fromDept = request.body.my_did;
            req_instance.toDept = request.body.did;
            req_instance.message = request.body.message;
            req_instance.status = 1;

            req_instance.fromUser = request.session._switchon_name + ' (' + request.session._switchon_email + ')';
            req_instance.toUser = request.body.uname;
            req_instance.fromDeptName = request.session._switchon_departmentName;
            req_instance.toDeptName = request.body.dname;

            req_instance.save(function (err) {
                if(!err){
                    data.code = 555;
                }
                response.end(JSON.stringify(data));
                io.emit('new request', req_instance);
            });
        });
    });

    app.get('/switchon/service/:type', isLoggedIn, function (request, response){
        
        var data = [];
        var opts = { toDept: request.session._switchon_departmentId };
        switch(request.params.type){
            case 'pending':
                opts.status = 1;
            break;
            case 'approved':
                opts.status = 0;
            break;
            case 'rejected':
                opts.status = -1;
            break;
            case 'confirm':
                opts.status = 1;
                opts.toUid = request.session._switchon_id;
            break;
        }
        requestModel.find(opts).sort({id: -1}).exec(function (err, docs) {
            if(!err){
                data = docs;
            }
            data.pageUri = request.params.type;
            data.userData = request.session;
            response.render('service', {requestData: data});
            
        });
        
    });

    app.get('/switchon/accept', isLoggedIn, function (request, response){

        var resdata = {code: -111};
        requestModel.findOneAndUpdate({id: request.query.id}, {$set:{status: 0 }} , function (err, docs) {
                if(!err){
                    resdata.code = 555;
                    resdata.id = request.query.id;
                }
                response.end(JSON.stringify(resdata));
                io.emit('approved request', docs);
        });

    });

    app.get('/switchon/reject', isLoggedIn, function (request, response){

        var resdata = {code: -111};
        requestModel.findOneAndUpdate({id: request.query.id}, {$set:{status: -1 }} , function (err, docs) {
                if(!err){
                    resdata.code = 555;
                    resdata.id = request.query.id;
                }
                response.end(JSON.stringify(resdata));
                io.emit('rejected request', docs);
        });

    });

};


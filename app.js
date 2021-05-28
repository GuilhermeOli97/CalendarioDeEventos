const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');
const app = express();
const urlencodeParser = bodyParser.urlencoded({extended:true});
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



const sql = mysql.createConnection({
    host: 'localhost' ,
    user: 'root',
    password: ' ',
    port: 3306

});
sql.query("use eventos");


//engines
app.engine("handlebars", handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars'); 
app.use('/css',express.static('css'));
app.use('/js',express.static('js'));



//define routes 

app.use('/', require('./routes/pages'))


//start server

app.listen(3000, function(req,res){
    console.log("Servidor rodando!");
});
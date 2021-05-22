const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');
const app = express();
const urlencodeParser = bodyParser.urlencoded({extended:false});
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


// routes and templates

app.get("/",function(req,res){res.render('index');});
app.get("/cadastrar",function(req,res){res.render('cadastrar');});
app.get("/listar",function(req,res){
    sql.query("select * from evento", function(err, results, fields){
        res.render('listar',{evento:results});
    })
});

app.post("/controllerForm",urlencodeParser,function(req,res){
    sql.query("insert into evento (inicio,termino,descricao) values(?,?,?)",[req.body.inicio, req.body.termino, req.body.descricao]);
    res.render('controllerForm', {desc: req.body.descricao});
})

app.get("/deletar/:id",function(req,res){
    sql.query("delete from evento where id=?",[req.params.id])
    res.render('deletar');
})

app.get("/atualizar/:id",function(req,res){
    sql.query("select * from evento where id=?",[req.params.id],function(err,results,fields){
        res.render('atualizar',{id:req.params.id,desc:results[0].descricao,inicio:results[0].inicio, termino:results[0].termino});
    });
})

app.post("/controllerUpdate",urlencodeParser,function(req,res){
    sql.query("update evento set inicio=?,termino=?,descricao=? where id=?",[req.body.inicio,req.body.termino,req.body.descricao,req.body.id]);
    res.render('controllerUpdate');
 });
//start server
app.listen(3000, function(req,res){
    console.log("Servidor rodando!");
});
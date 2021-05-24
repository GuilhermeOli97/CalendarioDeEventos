const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');
const app = express();
const urlencodeParser = bodyParser.urlencoded({extended:false});
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

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

app.use('/', require('./routes/pages'));


app.post("/controllerForm",urlencodeParser,function(req,res){
    sql.query("insert into evento (inicio,termino,descricao) values(?,?,?)",[req.body.inicio, req.body.termino, req.body.descricao]);
    res.render('controllerForm', {desc: req.body.descricao});
})

app.post("/controllerUpdate",urlencodeParser,function(req,res){
    sql.query("update evento set inicio=?,termino=?,descricao=? where id=?",[req.body.inicio,req.body.termino,req.body.descricao,req.body.id]);
    res.render('controllerUpdate');
 });

app.post("/controllerCadastroUsuario",urlencodeParser,function(req,res){
    //sql.query("insert into usuario (usuario, senha) values(?,?)", [req.body.usuario, req.body.senha]);
    sql.query("SELECT usuario from usuarios WHERE usuario = ?", [req.body.usuario], async (error, results) => {
        if(error){
            console.log(error);
        }    
        if(results.length > 0){
            return res.render('login',{
                message: "usuário já está em uso"
            })
        }
        let hashedPassword = await bcrypt.hash(req.body.senha, 8);
        console.log(hashedPassword);
        
        sql.query("INSERT INTO usuarios (usuario, senha) values(?,?)", [req.body.usuario, hashedPassword], (error,results)=>{
            if(error){
                console.log(error);
            } else {
                return res.render('login',{
                    message: "Usuário registrado"
                });
            }

        });
 
        
    })
})

app.post("/controllerLogin",urlencodeParser,function(req,res){
    try {
        if(!req.body.usuario || !req.body.senha){
            return res.status(400).render('login',{
                message: "forneça usuário e senha para realizar login"
            })
        }
        sql.query('SELECT * FROM usuarios WHERE usuario = ?',[req.body.usuario], async function(error,results){
            if(!results || !(await bcrypt.compare(req.body.senha, results[0].senha))){
                res.status(401).render('login',{
                    message: "usuário ou senha está incorreto"
                })
            } else {
                return res.render('index');
            }

        })
    } catch(error){
        console.log(error)
    }
    /*res.render('index',{
        message: "Login efetuado com sucesso!"
    });*/
});

//start server

app.listen(3000, function(req,res){
    console.log("Servidor rodando!");
});
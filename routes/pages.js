const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodeParser = bodyParser.urlencoded({extended:true});
const bcrypt = require('bcryptjs');
var session = require('express-session');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');


const sql = mysql.createConnection({
    host: 'localhost' ,
    user: 'root',
    password: ' ',
    port: 3306

});
sql.query("use eventos");

router.use(cookieParser());

router.use(session({
  key:'user_sid',
  secret: 'somerandonsttuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
}
  
}));


var hbsContent = {userName: '', loggedin: false}; 

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
		
        res.redirect('/home');
    } else {
        next();
    }    
};

router.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

router.get('/',sessionChecker,(req,res)=>{
    if (req.session.user && req.cookies.user_sid){
        res.render('home', hbsContent);
    }else{
        res.render('index', hbsContent);

    }
});

router.get('/home',(req,res)=>{
	if (req.session.user && req.cookies.user_sid){
    hbsContent.loggedin = true; 
	hbsContent.userName = req.session.user; 
	res.render('home',hbsContent);
    }else {
        res.redirect('/');
    }
});


router.get('/cadastrar',(req,res)=>{
	
	if (req.session.user && req.cookies.user_sid){
		res.render('cadastrar')}
	else{
	res.redirect('/');}	
});

router.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
		hbsContent.loggedin = false; 
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

router.get('/listar',(req,res)=>{
	
	if (req.session.user && req.cookies.user_sid){
		sql.query("select * from evento", function(err, results, fields){
        for(let i=0; i<results.length; i++){
            results[i].inicio = results[i].inicio.toLocaleString();
            results[i].termino = results[i].termino.toLocaleString();
        }
        res.render('listar',{evento:results});
    })
	} else {
		res.redirect('/');
	}		
});

router.get("/deletar/:id",function(req,res){
	if (req.session.user && req.cookies.user_sid){
        sql.query("delete from evento where id=?",[req.params.id])
        res.redirect('/listar');
	}
	else{
		res.redirect('/');
	}
})

router.get("/atualizar/:id",function(req,res){
    sql.query("select * from evento where id=?",[req.params.id],function(err,results,fields){
        res.render('atualizar',{id:req.params.id,desc:results[0].descricao,inicio:results[0].inicio, termino:results[0].termino});
    });
})


router.post("/controllerForm",urlencodeParser,function(req,res){
    const inicio = new Date(req.body.inicio);
    const termino = new Date(req.body.termino);
    if(inicio.getTime() > termino.getTime()){
        return res.render('cadastrar',{
            message: "A data de término deve ser posterior a data de início do evento"
        })
    }
    sql.query("insert into evento (inicio,termino,descricao) values(?,?,?)",[req.body.inicio, req.body.termino, req.body.descricao]);
    res.render('home');
})

router.post("/controllerUpdate",urlencodeParser,function(req,res){
    sql.query("update evento set inicio=?,termino=?,descricao=? where id=?",[req.body.inicio,req.body.termino,req.body.descricao,req.body.id]);
    res.redirect('/listar');
 });

router.post("/controllerCadastroUsuario",urlencodeParser,function(req,res){
    sql.query("SELECT usuario from usuarios WHERE usuario = ?", [req.body.usuario], async (error, results) => {
        if(error){
            console.log(error);
        } 
        if((!req.body.usuario) || (!req.body.senha)){
            return res.render('index',{
                message: "Preencha usuário e senha para realizar o cadastro"
            })
        }  
        if(results.length > 0){
            return res.render('index',{
                message: "usuário já está em uso"
            })
        }
        
        let hashedPassword = await bcrypt.hash(req.body.senha, 8);
        
        sql.query("INSERT INTO usuarios (usuario, senha) values(?,?)", [req.body.usuario, hashedPassword], (error,results)=>{
            if(error){
                console.log(error);
            } else {
                return res.render('index',{
                    message: "Usuário registrado"
                });
            }

        });
 
        
    })
})

router.post("/controllerLogin",urlencodeParser,function(req,res){
    try {
        
        if(!req.body.usuario || !req.body.senha){
            return res.status(400).render('index',{
                message: "forneça usuário e senha para realizar login"
            })
        }
        sql.query('SELECT * FROM usuarios WHERE usuario = ?',[req.body.usuario], async function(error,results){

            if(results.length == 0){
                return res.status(400).render('index',{
                    message: "usuário não cadastrado"
                })
            }
            
            if(!results || !(await bcrypt.compare(req.body.senha, results[0].senha))){
                res.status(401).render('index',{
                    message: "usuário ou senha está incorreto"
                })
            } else {
                
				req.session.user = req.body.usuario;
                hbsContent.loggedin = true; 
                hbsContent.userName = req.session.user; 
                res.render('home',hbsContent);
            }

        })
    } catch(error){
        console.log(error)
    }
});

module.exports = router;
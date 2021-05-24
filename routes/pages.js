const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const sql = mysql.createConnection({
    host: 'localhost' ,
    user: 'root',
    password: ' ',
    port: 3306

});
sql.query("use eventos");

router.get('/',(req,res)=>{
    res.render('login');
});
router.get('/registrar',(req,res)=>{
    res.render('registrar')
});

router.get('/cadastrar',(req,res)=>{
    res.render('cadastrar')
});

router.get("/listar",function(req,res){
    sql.query("select * from evento", function(err, results, fields){
        res.render('listar',{evento:results});
    })
});

router.get("/deletar/:id",function(req,res){
    sql.query("delete from evento where id=?",[req.params.id])
    res.render('deletar');
})

router.get("/atualizar/:id",function(req,res){
    sql.query("select * from evento where id=?",[req.params.id],function(err,results,fields){
        res.render('atualizar',{id:req.params.id,desc:results[0].descricao,inicio:results[0].inicio, termino:results[0].termino});
    });
})

module.exports = router;
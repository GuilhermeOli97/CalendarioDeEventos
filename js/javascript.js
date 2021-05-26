(function readyJS(win,doc){
    if(doc.querySelectorAll('.deletar')){
        console.log(doc.querySelectorAll('.deletar'));
        for(let i=0; i < doc.querySelectorAll('.deletar').length; i++){
            doc.querySelectorAll('.deletar')[i].addEventListener('click',function(event){
                if(confirm("Deseja mesmo apagar este dado?")){
                    location.href = this.getAttribute('data-href');
                }
            });
        }
    }
})(window,document);
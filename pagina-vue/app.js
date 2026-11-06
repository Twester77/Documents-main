const API="http://127.0.0.1:8000";

const app= Vue.createApp({
    data() {
        return {
            livros: [],
            codigo:"",
            resultado:"",
            titulo:"",
            autor:"",
            ano:"",
            mensagem:"",
            editando: null,
        };
    },
    methods: {
        async listarLivros() {
            const resposta = await fetch (API + "/livros");
            this.livros = await resposta.json();

        },
        async buscarLivro() {
            const resposta = await fetch (API + "/livros" + this.codigo);
            const livro = await resposta.json();
            if(!resposta.ok) {
                this.resultado = livro.detail;
                return;
            }
            this.resultado = '${livro.titulo} - ${livro.autor} (${livro.ano})';  
        }, 

        async cadastrarLivro() {
            const novo = {
           titulo: this.titulo,
           autor: this.autor,
           ano: Number(this.ano),
            };
            const resposta = await fetch (API + "/livros", {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify(novo),
            });
            const livro = await resposta.json();
            if (!resposta.ok) {
                this.mensagem = livro.detail;
                return;
            }
            this.mensagem =  `Cadastrado : ${livro.titulo} (codigo ${livro.id})`;
            this.titulo = "";
            this.autor = "";
            this.ano = "";
            this.livros.push(livro);
            this.resultado = `${livro.titulo} - ${livro.autor} (${livro.ano})`; 

    },

    async excluirLivro(livro) {
        const resposta = await fetch(API + "/livros/" + livro.id,{
              method:"DELETE",

         });
         if (resposta.ok) {
            this.mensagem = `Excluido: ${livro.titulo}`;
            this.listarLivros();
            return;
         }
         const erro = await resposta.json();
         this.mensagem = erro.detail;
    },
    editar(livro) {
        this.editando = livro.id;
        this.titulo = livro.titulo;
        this.autor = livro.autor;
        this.ano = livro.ano;

    },
    cancelar() {
        this.editando = null;
        this.titulo = "";
        this.autor= "";
        this.ano= "";
    },


    async alterarLivro() {
        const dados = {
            titulo: this.titulo,
            autor: this.autor,
            ano: Number(this.ano),
        };
        const resposta = await fetch(API + "/livros/" + this.editando, {
             method: "PUT",
             headers: {"Content-Type": "application/json" },
             body: JSON.stringify(dados),
        });
        const livro = await resposta.json();
        if(!resposta.ok) {
            this.mensagem = livro.detail;
            return;
            
        }
        this.mensagem = `Alterado: ${livro.titulo} (codigo ${livro.id})`;
        this.cancelar();
        this.listarLivros();  


    },
},
    mounted() {
        this.listarLivros();

    },

}).mount("#app");
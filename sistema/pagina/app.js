const API = "http://127.0.0.1:8000";

// --- LISTAR LIVROS (GET) ---
async function listarLivros() {
    const resposta = await fetch(API + "/livros");
    const livros = await resposta.json();
    
    const lista = document.getElementById("lista");
    lista.innerHTML = ""; 

    for (const livro of livros) {
        const item = document.createElement("li");
        item.textContent = `${livro.id} - ${livro.titulo} (${livro.ano})`;
        lista.appendChild(item);
    }
}

// --- BUSCAR LIVRO (GET) ---
async function buscarLivro() {
    const codigo = document.getElementById("codigo").value;
    const resultado = document.getElementById("resultado");

    const resposta = await fetch(API + "/livros/" + codigo);
    const livro = await resposta.json();

    if (!resposta.ok) {
        resultado.textContent = livro.detail;
        return;
    }
    resultado.textContent = `${livro.titulo} - ${livro.autor} (${livro.ano})`;
}

// --- CADASTRAR LIVRO (POST) ---
async function cadastrarLivro() {
    const campoTitulo = document.getElementById("titulo");
    const campoAutor = document.getElementById("autor");
    const campoAno = document.getElementById("ano");
    const mensagem = document.getElementById("mensagem");

    const novo = {
        titulo: campoTitulo.value,
        autor: campoAutor.value,
        ano: Number(campoAno.value)
    };

    const resposta = await fetch(API + "/livros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novo)
    });

    const livro = await resposta.json();

    if (!resposta.ok) {
        mensagem.textContent = livro.detail;
        return;
    }

    mensagem.textContent = `Cadastrado: ${livro.titulo} (código ${livro.id})`;
    campoTitulo.value = "";
    campoAutor.value = "";
    campoAno.value = "";
    listarLivros();
}

// --- EXCLUIR LIVRO (DELETE) ---
async function excluirLivro() {
    const codigo = document.getElementById("codigo-excluir").value;
    const mensagem = document.getElementById("mensagem-excluir");

    const resposta = await fetch(API + "/livros/" + codigo, {
        method: "DELETE"
    });

    // 204 é "feito, sem corpo". O status vem primeiro!
    if (resposta.ok) {
        mensagem.textContent = `Excluído o livro de código ${codigo}`;
        listarLivros();
        return;
    }
    
    // Se deu erro (ex: 404), aí sim lemos o corpo
    const erro = await resposta.json();
    mensagem.textContent = erro.detail;
}

// --- ALTERAR LIVRO (PUT) ---
async function alterarLivro() { 
    const codigo = document.getElementById("codigo-alterar").value;
    const campoTitulo = document.getElementById("novo-titulo");
    const campoAutor = document.getElementById("novo-autor");
    const campoAno = document.getElementById("novo-ano");
    const mensagem = document.getElementById("mensagem-alterar");
    
    const dados = { 
        titulo: campoTitulo.value,
        autor: campoAutor.value,
        ano: Number(campoAno.value),
    };

    const resposta = await fetch(API + "/livros/" + codigo, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
    });

    const livro = await resposta.json();
    if(!resposta.ok) {
        mensagem.textContent = livro.detail;
        return;
    }
    
    mensagem.textContent = `Alterado: ${livro.titulo} (código ${livro.id})`;
    listarLivros();
}

// --- AMARRANDO OS BOTÕES ---
const botaoListar = document.getElementById("botao-listar");
botaoListar.addEventListener("click", listarLivros);

const botaoBuscar = document.getElementById("botao-buscar");
botaoBuscar.addEventListener("click", buscarLivro);

const botaoCadastrar = document.getElementById("botao-cadastrar");
botaoCadastrar.addEventListener("click", cadastrarLivro);

const botaoExcluir = document.getElementById("botao-excluir");
botaoExcluir.addEventListener("click", excluirLivro);

const botaoAlterar = document.getElementById("botao-alterar");
botaoAlterar.addEventListener("click", alterarLivro);
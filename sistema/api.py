import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles

from dominio.livro import Livro
from dados.repositorio_livro import RepositorioLivro

app = FastAPI()


def para_dict(livro):
    return {
        "id": livro.id,
        "titulo": livro.titulo,
        "autor": livro.autor,
        "ano": livro.ano,
    }

def para_livro(corpo):
    return Livro(corpo["titulo"], corpo["autor"], int(corpo["ano"]))


@app.get("/")
def inicio():
    return {"mensagem": "API da biblioteca"}


@app.get("/livros")
def listar_livros():
    repositorio = RepositorioLivro()
    livros = repositorio.listar()
    repositorio.fechar()
    return [para_dict(livro) for livro in livros]


@app.get("/livros/{codigo}")
def buscar_livro(codigo: int):
    repositorio = RepositorioLivro()
    livro = repositorio.buscar_por_id(codigo)
    repositorio.fechar()
    if livro is None:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    return para_dict(livro)

@app.get("/busca")
def buscar_por_titulo(titulo, str):
    repositorio = RepositorioLivro()
    livros = repositorio.buscar_por_titulo(titulo)
    repositorio.fechar()
    return [para_dict(livro) for livro in livros]
    

@app.post("/livros", status_code=201)
def cadastrar_livro(corpo: dict):
    try:
        livro = para_livro(corpo)
    except (KeyError, ValueError) as erro:
        raise HTTPException(status_code=400, detail=str(erro))
    repositorio = RepositorioLivro()
    repositorio.salvar(livro)
    repositorio.fechar()
    return para_dict(livro)

@app.put("/livros/{codigo}")
def atualizar_livro(codigo: int, corpo: dict):
    try:
        livro = para_livro(corpo)
    except (KeyError, ValueError) as erro:
        raise HTTPException(status_code=400, detail=str(erro))
    repositorio = RepositorioLivro()
    if repositorio.buscar_por_id(codigo) is None:
        repositorio.fechar()
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    livro.id = codigo
    repositorio.atualizar(livro)
    repositorio.fechar()
    return para_dict(livro)

@app.delete("/livros/{codigo}", status_code=204)
def excluir_livro(codigo: int):
    repositorio = RepositorioLivro()
    if repositorio.buscar_por_id(codigo) is None:
        repositorio.fechar()
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    repositorio.excluir(codigo)
    repositorio.fechar()

app.mount("/tela", StaticFiles(directory="pagina-vue", html=True), name ="tela")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0")
    uvicorn.run(app)

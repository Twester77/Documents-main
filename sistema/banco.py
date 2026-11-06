import sqlite3

conexao = sqlite3.connect("biblioteca.db")
cursor = conexao.cursor()

cursor.execute("""
    CREATE TABLE IF NOT EXISTS livro (
        id     INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT    NOT NULL,
        autor  TEXT,
        ano    INTEGER
    )
""")
cursor.execute("SELECT COUNT(*) FROM livro")
if cursor.fetchone()[0] == 0:
    livros = [
        ("Dom Casmurro", "Machado de Assis", 1899),
        ("Iracema", "Jose de Alencar", 1865),
        ("O Cortico", "Aluisio Azevedo", 1890),
    ]
    for titulo, autor, ano in livros:
        cursor.execute(
            "INSERT INTO livro (titulo, autor, ano) VALUES (?, ?, ?)",
            (titulo, autor, ano),
        )
    conexao.commit()

cursor.execute("SELECT id, titulo, autor, ano FROM livro")
for codigo, titulo, autor, ano in cursor.fetchall():
    print(f"{codigo} - {titulo} - {autor} ({ano})")

conexao.close()

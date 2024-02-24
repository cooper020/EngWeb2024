import json
import os

# Cria a pasta principal 'html' se ainda não existir
html_dir = 'html'
os.makedirs(html_dir, exist_ok=True)

# Carrega os dados do arquivo JSON
with open('db.json', 'r') as file:
    dados = json.load(file)

def criar_pagina_individual(tipo, dados):
    # Cria a pasta secundária para cada tipo de categoria
    tipo_dir = os.path.join(html_dir, f'{tipo}_html')
    os.makedirs(tipo_dir, exist_ok=True)
    
    with open(os.path.join(tipo_dir, 'index.html'), 'w') as f:

        f.write('<!DOCTYPE html>\n<html>\n<head>\n<title>' + tipo.capitalize() + '</title>\n</head>\n<body>\n')
        
        f.write(f'<h1>{tipo.capitalize()}</h1>\n')

        f.write('<ul>\n')
        for item in dados:
            with open(os.path.join(tipo_dir, f'{item["id"]}.html'), 'w') as subf:

                link_text = item.get("designacao", "#text") if tipo == "cursos" else item.get("#text") if tipo == "instrumentos" else item.get("nome", "Detalhes")
                title_text = item.get("designacao", "#text") if tipo == "cursos" else item.get("#text") if tipo == "instrumentos" else item.get("nome", "Detalhes")

                subf.write('<!DOCTYPE html>\n<html>\n<head>\n<title>' + title_text + '</title>\n</head>\n<body>\n')
                subf.write(f'<h1>{title_text}</h1>\n')
                for chave, valor in item.items():
                    if chave == "instrumento":
                        # Cria um link para a página do instrumento
                        if isinstance(valor, dict):
                            link_instrumento = valor.get("#text", "")
                            id_instrumento = valor.get("id", "")
                            valor = f'<a href="../instrumentos_html/{id_instrumento}.html">{link_instrumento}</a>'
                        else:
                            valor = f'<a href="../instrumentos_html/{id_instrumento}.html">{valor}</a>'
                    subf.write(f'<p><strong>{chave.capitalize()}:</strong> {valor}</p>\n')

                subf.write('</body>\n</html>')
            
            f.write(f'<li><a href="{item["id"]}.html">{link_text}</a></li>\n')
        f.write('</ul>\n')
        
        f.write('</body>\n</html>')


        

criar_pagina_individual('alunos', dados['alunos'])
criar_pagina_individual('cursos', dados['cursos'])
criar_pagina_individual('instrumentos', dados['instrumentos'])

with open(os.path.join(html_dir, 'index.html'), 'w') as f:

    f.write('<!DOCTYPE html>\n<html>\n<head>\n<title>Índice</title>\n</head>\n<body>\n')

    f.write('<h1>Escola de música</h1>\n')
    f.write('<ul>\n')
    f.write(f'<li><a href="alunos_html/index.html">Alunos</a></li>\n')
    f.write(f'<li><a href="cursos_html/index.html">Cursos</a></li>\n')
    f.write(f'<li><a href="instrumentos_html/index.html">Instrumentos</a></li>\n')
    f.write('</ul>\n')

    f.write('</body>\n</html>')

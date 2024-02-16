import os
import xml.etree.ElementTree as ET

def parse_xml(xml_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    return root

def generate_html(root):
    html = "<html>\n<body>\n"
    meta = root.find('meta')
    corpo = root.find('corpo')
    
    html += f"<h1>{meta.find('nome').text}</h1>\n"
    html += f"<p>Número: {meta.find('número').text}</p>\n"
    
    lista_figura = corpo.findall('figura')
    if lista_figura is not None:
        for figura in lista_figura:
            html += "<div>\n"

            lista_imagem = figura.findall('imagem')
            if lista_imagem is not None:
                for imagem in lista_imagem:
                    path = imagem.get('path')
                    if path is not None:
                        path1 = path.replace('../imagem', '../MapaRuas-materialBase/imagem')
                        html += f"<img src='{path1}' style='width:50%; height:auto; '/>\n"

            legenda = figura.find('legenda')
            if legenda is not None:
                html += f"<p>Legenda: {legenda.text}</p>\n"

            html += "</div>\n"

    html += "<h2>Descrição:</h2>\n"
    html += "<div>\n"
    lista_para = corpo.findall('para')
    if lista_para is not None:
        for para in lista_para:
            html += "<div>\n"    
            para_text = "".join(para.itertext())
            html += f"<p>{para_text}</p>\n"
        html += "</div>\n"

    html += "<h2>Casas:</h2>\n"
    lista_casas = corpo.find('lista-casas')
    if lista_casas is not None:
        for casa in lista_casas.findall('casa'):
            html += "<div>\n"
            numero = casa.find('número')
            if numero is not None:
                html += f"<p>Número: {numero.text}</p>\n"
            
            enfiteuta = casa.find('enfiteuta')
            if enfiteuta is not None:
                html += f"<p>Enfiteuta: {enfiteuta.text}</p>\n"
            
            foro = casa.find('foro')
            if foro is not None:
                html += f"<p>Foro: {foro.text}</p>\n"
            
            desc = casa.find('desc')
            if desc is not None and desc.find('para') is not None:
                desc_text = "".join(desc.itertext())
                html += f"<p>Descrição: {desc_text}</p>\n\n\n\n"
            
            html += "</div>\n"

            
    html += "<h2>Atualmente:</h2>\n"

    texto_numero = meta.find('número').text
    resultado = texto_numero + "-"
    pasta_imagens = f"./MapaRuas-materialBase/atual/"
    if os.path.exists(pasta_imagens):
        for filename in os.listdir(pasta_imagens):
            if filename.startswith(str(resultado)):
                path2 = os.path.join(pasta_imagens, filename)
                path3 = path2.replace('./MapaRuas-materialBase/atual/', '../MapaRuas-materialBase/atual/')
                html += f"<img src='{path3}' style='width:50%; height:auto; '/>\n"

    html += "</body>\n</html>"
    return html


def copy_clean_filename(filename):
    clean_name = filename[7:-4].replace('_', ' ')
    return clean_name

def create (pasta, pasta_html):
    os.makedirs(pasta_html, exist_ok=True)

    for nome_arquivo in os.listdir(pasta):

        if nome_arquivo.endswith('.xml'):
            xml_file = os.path.join(pasta, nome_arquivo)
            root = parse_xml(xml_file)
            html_content = generate_html(root)
            nome_html = copy_clean_filename(nome_arquivo)

            with open(os.path.join(pasta_html, nome_html + '.html'), 'w') as f:
                f.write(html_content)

def main():
    pasta = './MapaRuas-materialBase/texto'
    pasta_html = 'html'
    create (pasta, pasta_html)

if __name__ == "__main__":
    main()
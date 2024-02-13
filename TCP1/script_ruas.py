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

            imagem = figura.find('imagem')
            if imagem is not None:
                html += f"<img src='{imagem.get('imagem path')}'/>\n"

            legenda = figura.find('legenda')
            if legenda is not None:
                html += f"<p>Legenda: {legenda.text}</p>\n"


            lista_para = figura.findall('para')
            if lista_para is not None:
                for para in lista_para:
                    html += "<div>\n"

                    lugar = para.find('lugar')
                    if lugar is not None:
                        html += f"<p>Lugar: {lugar.text}</p>"

                    data = para.find('data')
                    if data is not None:
                        html += f"<p>Data: {data.text}</p>"

                    entidade = para.find('entidade')
                    if entidade is not None:
                        html += f"<p>Entidade: {entidade.text}</p>"          
            
                    html += "</div>\n"
            
            
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
                html += f"<p>Descrição: {desc.find('para').text}</p>\n"
            
            html += "</div>\n"
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
    pasta = 'MapaRuas-materialBase/texto'
    pasta_html = 'html'
    create (pasta, pasta_html)

if __name__ == "__main__":
    main()
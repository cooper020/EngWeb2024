var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates') 
var static = require('./static.js')        


function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}


var compositoresServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request - ver se o conteúdo é estático
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /compositores --------------------------------------------------------------------
                if(req.url == '/' || req.url == '/compositores'){
                    axios.get("http://localhost:3000/compositores?_sort=nome")
                        .then(resp =>{
                            compositores = resp.data
                            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write(templates.compositoresListPage(compositores, d))
                            res.end()
                        })
                        .catch(erro =>{
                            res.writeHead(503, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p> Não foi possível obter a lista de compositores:" + req.method + "</p>")
                            res.end()
                        })

                }

                // GET /compositores/:id --------------------------------------------------------------------
                else if(/\/compositores\/(C)[0-9]+$/i.test(req.url)){
                    id = req.url.split('/')[3]
                    axios.get("http://localhost:3000/compositores/" + id)
                        .then(resp => {
                            compositores = resp.data
                            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write(templates.compositoresPage(compositores, d))
                            res.end()
                        })
                        .catch(erro =>{
                            res.writeHead(504, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter a informação do compositor " + id + " :: " + erro + "</p>")
                            res.end()
                        })
                }

            
                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if (/\/compositores\/edit\/(C)[0-9]+$/i.test(req.url)) {
                    id = req.url.split('/')[3];
                    axios.get("http://localhost:3000/compositores/" + id) // Corrigido para buscar dados do compositor por ID
                        .then(resp => {
                            compositores = resp.data
                            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.write(templates.compositoresFormEditPage(compositores, d));
                            res.end();
                        })
                        .catch(erro => {
                            res.writeHead(505, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.write("<p>Não foi possível obter a informação do compositor " + id + " :: " + erro + "</p>");
                            res.end();
                        });
                }


                // GET /compositores/delete/:id --------------------------------------------------------------------
                else if (/\/compositores\/delete\/(C)[0-9]+$/i.test(req.url)) {
                    const id = req.url.split('/')[3];
                    axios.get(`http://localhost:3000/compositores/${id}`)
                        .then(resp => {
                            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.write(templates.compositoresFormDeletePage(resp.data, d));
                            res.end();
                        })
                        .catch(erro => {
                            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.write(`<p>Não foi possível excluir o compositor ${id} :: ${erro}</p>`);
                            res.end();
                        });
                        
                } else if(req.url == '/compositores/registo'){  
                    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                    res.write(templates.compositoresFormPage(d))
                    res.end()
                }
           
                // GET /periodos
                else if(req.url == '/periodos') {
                    axios.get("http://localhost:3000/periodos")
                        .then(resp =>{
                            compositores = resp.data;
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                            res.write(templates.periodosListPage(compositores));
                            res.end();
                        })
                        .catch(erro =>{
                            res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'});
                            res.write("<p>Não foi possível obter a lista de períodos: " + erro + "</p>");
                            res.end();
                        });
                }

                // GET /periodos/{id}
                else if(req.url.startsWith('/periodos/')) {
                    id = req.url.split('/')[2];
                    axios.get("http://localhost:3000/periodos/" + id)
                        .then(resp =>{
                            compositores = resp.data;
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                            res.write(templates.compositoresPeriodoPage(compositores, id, d));
                            res.end();
                        })
                        .catch(erro =>{
                            res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'});
                            res.write("<p>Não foi possível obter a lista de compositores do período" + id + erro + "</p>");
                            res.end();
                        });
                }

                // GET /periodos/criar - Retorna o formulário para criar um novo período
                else if (req.url == '/periodos/registo') {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.write(templates.periodoFormPage(d));
                    res.end();
                }

                // GET /periodos/edit/:id - Retorna o formulário para editar um período específico
                else if (/\/periodos\/edit\/(C)[0-9]+$/i.test(req.url)) {
                    const id = req.url.split('/')[3];
                    axios.get(`http://localhost:3000/periodos/${id}`)
                        .then(resp => {
                            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.write(templates.periodoEditFromPage(resp.data, d));
                            res.end();
                        })
                        .catch(erro => {
                            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.write(`<p>Não foi possível obter as informações do período ${id} :: ${erro}</p>`);
                            res.end();
                        });
                }

                // GET /periodos/delete/:id - Retorna o formulário para confirmar a exclusão de um período
                else if (/\/periodos\/delete\/(C)[0-9]+$/i.test(req.url)) {
                    const id = req.url.split('/')[3];
                    axios.get(`http://localhost:3000/periodos/${id}`)
                        .then(resp => {
                            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.write(templates.periodosDeleteConfirmationPage(resp.data, d));
                            res.end();
                        })
                        .catch(erro => {
                            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.write(`<p>Não foi possível obter as informações do período ${id} :: ${erro}</p>`);
                            res.end();
                        });
                }

            
                // GET request -> Erro
                else{
                    res.writeHead(500, {'Content-Type' : 'text/html; charset=utf-8'})
                    res.write("<p> GET request não suportado:" + req.method + "</p>")
                    res.end()
                }
                break
            

                case "POST":
                    // POST /compositores/registo
                    if (req.url == '/compositores/registo') {
                        collectRequestBodyData(req, (data) => {
                            axios.put('http://localhost:3000/compositores', data)
                                .then(resp => {
                                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                                    res.write("<p>Compositor " + data.nome + "foi registrado com sucesso.</p>");
                                    res.end();
                                })
                                .catch(erro => {
                                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                                    res.write(`<p>Não foi possível registrar o compositor ${data.nome} :: ${erro}</p>`);
                                    res.end();
                                });
                        });

                    } else if (req.url.startsWith('/compositores/edit/') && req.method === "POST") {
                        const id = req.url.split('/')[3];
                        axios.put(`http://localhost:3000/compositores/${id}`)
                            .then(resp => {
                                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.write("<p>Compositor " + id + "foi alterado com sucesso.</p>");
                                res.end();
                            })
                            .catch(erro => {
                                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.write(`<p>Não foi possível excluir o compositor ${id} :: ${erro}</p>`);
                                res.end();
                            });
                    }
                    
                    else if (req.url.startsWith('/compositores/delete/') && req.method === "POST") {
                        const id = req.url.split('/')[3];
                        axios.delete(`http://localhost:3000/compositores/${id}`)
                            .then(resp => {
                                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.write("<p>Compositor " + id + "foi eliminado com sucesso.</p>");
                                res.end();
                            })
                            .catch(erro => {
                                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.write(`<p>Não foi possível excluir o compositor ${id} :: ${erro}</p>`);
                                res.end();
                            });
                    }

                    // POST /periodos/registo
                    else if (req.url == '/periodos/registo') {
                        collectRequestBodyData(req, (data) => {
                            axios.post('http://localhost:3000/periodos', data)
                                .then(resp => {
                                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                                    res.write("<p>Período " + data.nome + " foi registrado com sucesso.</p>");
                                    res.end();
                                })
                                .catch(erro => {
                                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                                    res.write(`<p>Não foi possível registrar o período ${data.nome} :: ${erro}</p>`);
                                    res.end();
                                });
                        });
                    }
                    

                    else if (req.url.startsWith('/periodos/edit/') && req.method === "POST") {
                        const id = req.url.split('/')[3];
                        axios.put(`http://localhost:3000/periodos/${id}`)
                            .then(resp => {
                                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.write("<p>Período " + id + " foi alterado com sucesso.</p>");
                                res.end();
                            })
                            .catch(erro => {
                                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.write(`<p>Não foi possível alterar o período ${id} :: ${erro}</p>`);
                                res.end();
                            });
                    }
                    
                    
                    else if (req.url.startsWith('/periodos/delete/') && req.method === "POST") {
                        const id = req.url.split('/')[3];
                        axios.delete(`http://localhost:3000/periodos/${id}`)
                            .then(resp => {
                                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.write("<p>Período " + id + " foi eliminado com sucesso.</p>");
                                res.end();
                            })
                            .catch(erro => {
                                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.write(`<p>Não foi possível excluir o período ${id} :: ${erro}</p>`);
                                res.end();
                            });
                    }
                    
        break;

                    
                
            default: 
                // Outros metodos nao sao suportados
                res.writeHead(500, {'Content-Type' : 'text/html; charset=utf-8'})
                res.write("<p> POST request não suportado:" + req.method + "</p>")
                res.end()
                break
        }
    }
})


compositoresServer.listen(3003, ()=>{
    console.log("Servidor à escuta na porta 3003...")
})
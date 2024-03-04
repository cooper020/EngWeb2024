var http = require('http')
var fs = require('fs')
var url = require('url')
var axios = require('axios')

// Carrega os dados do arquivo JSON
var filmes = require('./filmes_fixed.json');

function genFilmesHTML(filmes) {
    let pagHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-blue">
                    <h1>Filme</h1>
                </header>
                <div class="w3-container">
                    <table class="w3-table w3-striped">
                    
    `;

    filmes.forEach(filme => {
        pagHTML += `
        <ul>
            <li><b>ID:</b> ${filme.id}</li>
            <br>
            <li><b>Título:</b> ${filme.title}</li>
            <br>
            <li><b>Ano:</b> ${filme.year}</li>
            <br>
            <li><b>Elenco:</b> ${filme.cast.join(', ')}</li>
            <br>
            <li><b>Género(s):</b> ${filme.genres ? filme.genres.join(', ') : ''}</li>
        </ul>
        <br>
        `;
    });

    pagHTML += `
                    </table>
                </div>
            </div>
        </body>
        </html>
    `;
    return pagHTML;
}

http.createServer((req, res) => {
    console.log(req.method + " " + req.url);

    var q = url.parse(req.url, true)

    if (q.pathname === '/') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Opções</title>
                <link rel="stylesheet" href="w3.css"/>
            </head>
            <body>
                <h1>Bem vindo à página de filmes:</h1>
                <h2>Escolha uma opção:</h2>
                <ul>
                    <li><a href="/filmes">Filmes</a></li>
                    <li><a href="/cast">Atores</a></li>
                    <li><a href="/genres">Géneros</a></li>
                </ul>
            </body>
            </html>
        `);
        res.end();

    } else if (q.pathname === '/filmes') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write('<h1>Lista de Filmes</h1>');
        filmes.forEach(filme => {
            res.write(`<p><a href="/filmes/${filme.filmes.id}">${filme.filmes.title}</a></p>`);
        });
        res.end();
    } else if (q.pathname.startsWith('/filmes/')) {
        let id = q.pathname.split('/')[2];
        let filmeData = filmes.find(item => item.filmes.id === id);
        if (filmeData) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write(genFilmesHTML([filmeData.filmes]));
        } else {
            res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
            res.write('<h1>404 Not Found</h1>');
        }
        res.end();
    }
    
    
    
    else if (q.pathname === '/cast') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write('<h1>Lista de Atores</h1>');
        let atores = new Set();
        filmes.forEach(filme => { 
            if(filme && filme.filmes.cast){
                filme.filmes.cast.forEach(ator => { 
                    atores.add(ator);
                }) 
            }
        });
        atores.forEach(ator => {
            res.write(`<p><a href="/cast/${encodeURI(ator)}">${ator}</a></p>`);
        });
        res.end();
    
    } else if (q.pathname.startsWith('/cast/')) {
        let ator = decodeURI(q.pathname.split('/')[2]);
        let filmesAtor = filmes.filter(filme => filme.filmes.cast.includes(ator));
        if (filmesAtor.length > 0) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write(`<h1>Filmes com ${ator}</h1>`);
            filmesAtor.forEach(filme => {
                res.write(`<p><a href="/filmes/${filme.filmes.id}">${filme.filmes.title}</a></p>`);
            });
        } else {
            res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
            res.write('<h1>404 Not Found</h1>');
        }
        res.end();
    }
    else if (q.pathname === '/genres') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write('<h1>Lista de Géneros</h1>');
        let generos = new Set();
        filmes.forEach(filme => { 
            if(filme && filme.filmes.genres){
                filme.filmes.genres.forEach(genero => { 
                    generos.add(genero);
                }) 
            }
        });
        generos.forEach(genero => {
            res.write(`<p><a href="/genres/${encodeURI(genero)}">${genero}</a></p>`);
        });
        res.end();
    
    } else if (q.pathname.startsWith('/genres/')) {
        let genero = decodeURI(q.pathname.split('/')[2]);
        let filmesGenero = filmes.filter(filme => filme.filmes.genres && filme.filmes.genres.includes(genero));
        if (filmesGenero.length > 0) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write(`<h1>Filmes do género ${genero}</h1>`);
            filmesGenero.forEach(filme => {
                res.write(`<p><a href="/filmes/${filme.filmes.id}">${filme.filmes.title}</a></p>`);
            });
        } else {
            res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
            res.write('<h1>404 Not Found</h1>');
        }
        res.end();
    } else {
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
        res.write('<h1>404 Not Found</h1>');
        res.end();
    }
}).listen(5000);
console.log("Servidor na porta 5000...");

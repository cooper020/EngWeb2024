var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var filepath = '';
    
    if (q.pathname === '/') {
        filepath = 'html/index.html';
    } else {
        // Construa o caminho do arquivo com base no diretório e no nome do arquivo solicitado
        var directories = q.pathname.split('/').filter(Boolean); // Remove strings vazias
        filepath = path.join.apply(null, ['html'].concat(directories));
    }

    fs.readFile(filepath, function (erro, dados) {
        if (erro) {
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end("<p>Erro interno do servidor.</p>");
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write(dados);
            res.end();
        }
    });
}).listen(3010);

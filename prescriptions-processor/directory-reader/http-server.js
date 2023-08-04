const http = require('http');

function startHttpServer(collectDataToSend) {
    http.createServer((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify(collectDataToSend()));
    }).listen(8080);
}

module.exports = {
    startHttpServer
};

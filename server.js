var gaService = require('./data.js');
var restify = require('restify');

gaService.startGaClient();

function respond(req, res, next) {
    var results = gaService.retrieveResults();
    res.send(results);
    next();
}

var server = restify.createServer({});
server.get('/from/:start/to/:end', respond);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});

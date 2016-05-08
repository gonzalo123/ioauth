var io = require('socket.io')(3000),
    http = require('http');

io.use(function (socket, next) {
    var sessionId = socket.handshake.query.token,
        options = {
            host: 'localhost',
            port: 8080,
            path: '/getSessionID',
            headers: {Cookie: 'PHPSESSID=' + sessionId}
        };

    http.request(options, function (response) {
        response.on('error', function () {
            next(new Error("not authorized"));
        });
        response.on('data', function (chunk) {
            var sessionIdFromRequest;
            try {
                sessionIdFromRequest = JSON.parse(chunk.toString());
            } catch (e) {
                next(new Error("not authorized"));
            }

            if (sessionId == sessionIdFromRequest) {
                next();
            } else {
                next(new Error("not authorized"));
            }
        });
    }).end();
});

io.on('connection', function (socket) {
    setInterval(function() {
        socket.emit('hello', {hello: 'world'});
    }, 1000);
});
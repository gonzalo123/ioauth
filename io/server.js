var io = require('socket.io')(3000),
    http = require('http');

io.use(function (socket, next) {
    var options = {
        host: 'localhost',
        port: 8080,
        path: '/private',
        headers: {Cookie: 'PHPSESSID=' + socket.handshake.query.token}
    };

    http.request(options, function (response) {
        response.on('error', function () {
            next(new Error("not authorized"));
        }).on('data', function () {
            next();
        });
    }).end();
});

io.on('connection', function () {
    console.log("connected!");
});
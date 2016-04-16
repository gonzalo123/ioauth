var io = require('socket.io')(3000),
    http = require('http'),
    options;

options = {
    host: 'localhost',
    port: 8080,
    headers: {Cookie: undefined},
    path: '/private'
};

io.on('connection', function (socket) {
    // now we need to validate our token
    options.headers.Cookie = 'PHPSESSID=' + socket.handshake.query.token;

    // in this example our token is a PHP session so we'll perform a http
    // request to a private route using this session
    http.request(options, function (response) {
        response.on('error', function () {
            // if our request returns an error that means our session isn't
            // valid one, so we disconnect our socket.io connection
            socket.disconnect('unauthorized');
        });
    }).end();
});
const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const server = http.createServer();
const wss1 = new WebSocket.Server({
    server
});
const wss2 = new WebSocket.Server({
    noServer: true
});

wss1.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('something');

});

wss2.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('something');
});

server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url.parse(request.url).pathname;
    console.log("****1111");
    console.log(pathname);
    console.log(request.headers['sec-websocket-key']);
    
    if (pathname === '/foo') {
        console.log("****2222");
        
        wss1.handleUpgrade(request, socket, head, function done(ws) {
            console.log("****3333");
            wss1.emit('connection', ws, request);
        });
    } else if (pathname === '/bar') {
        wss2.handleUpgrade(request, socket, head, function done(ws) {
            wss2.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

server.listen(8999,()=>{console.log("port 8999")});
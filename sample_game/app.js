const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
var id = 1;
const id_username = new Map();

wss.on('connection', (ws) => {
  console.log('Connected!');

  ws.on('message', (message) => {
    id_username.set(id, message);
    console.log(`${id}=${id_username.get(id)}`);
    id++;
  });
});

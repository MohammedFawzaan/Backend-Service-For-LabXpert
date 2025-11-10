import http from 'http';
import app from './app.js';
import initializeSocket from './socket.js';

const server = http.createServer(app);
const port = process.env.PORT;

initializeSocket(server);

server.listen(port, () => {
    console.log(`App is Listening on ${port}`);
});

export default server;
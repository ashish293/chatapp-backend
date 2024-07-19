import http from 'http';
import { Server } from 'socket.io';

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.use('/api', routes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    // methods: ['GET', 'POST'],
  },
});

app.post('/emit-message', (req, res) => {
  const message = req.body.message;
  io.emit('chat message', message);
  res.send({ status: 'Message sent', message: message });
});
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg); // Broadcast the message to all clients
  });
});
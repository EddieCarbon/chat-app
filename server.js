require('dotenv').config(); 

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
mongoose.connection.on('error', (err) => {
    console.log(`Database Connection Error: ${err.message}`);
});
mongoose.connection.once('open', () => {
    console.log('MongoDB Connected!');
});

// Bring in the models
require('./models/Chatroom');
require('./models/Messages');
require('./models/User');

const app = require('./app');

const server = app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

const io = require("socket.io")(server, {
    allowEIO3: true,
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  
const jwt = require('jwt-then');

const Message = mongoose.model('Message');
const User = mongoose.model('User');

io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const payload = await jwt.verify(token, process.env.SECRET);
      socket.userId = payload.id;
      next();
    } catch (err) {}
});

io.on("connection", (socket) => {
    console.log("Connected: " + socket.userId);
  
    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.userId);
    });
  
    socket.on("joinRoom", ({ id }) => {
      socket.join(id);
      console.log("A user joined chatroom: " + id);
    });
  
    socket.on("leaveRoom", ({ id }) => {
      socket.leave(id);
      console.log("A user left chatroom: " + id);
    });
  
    socket.on("chatroomMessage", async ({ id, message }) => {
      if (message.trim().length > 0) {
        const user = await User.findOne({ _id: socket.userId });
        const newMessage = new Message({
          chatroom: id,
          user: socket.userId,
          message,
        });
        io.to(id).emit("newMessage", {
          message,
          name: user.name,
          userId: socket.userId,
        });
        await newMessage.save();
      }
    });
});
const express = require("express");
const port = process.env.PORT || 3000;
const cors = require('cors');
const {Server} = require("socket.io");
const {createServer} = require("http");
const jwt = require("jsonwebtoken");
const {RoomUser } = require("./models/postgres");

const SecurityRouter = require("./routes/Security");
const AdminRouter = require("./routes/Admin");
const RoomRouter = require("./routes/Room");

const corsOption = {
    origin: ['http://localhost:3000'],
};

const app = express();
const http = createServer(app);


const io = new Server(
    http,
    {
        cors: corsOption,
    }
);

app.use(express.json());
app.use(cors(corsOption));

app.use(SecurityRouter);
app.use("/admin", AdminRouter);
app.use("/room", RoomRouter);

app.get("/", (req, res, next) => {
    res.send("Hello world!");
});


const sessions = new Map();

const saveSession = (id,session) =>{
  sessions.set(id, session);
}
const getSessions = () => {
  return [...sessions.values()];
}

io.use(async(socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token){
  
    const token = socket.handshake.auth.token;
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    socket.user_id = payload.id;
    socket.is_admin = payload.isAdmin;
    socket.email = payload.email;
    socket.connected = true;
    next();
  
  }
  else {
    next(new Error('Authentication error'));
  }    
})
io.on('connection', function(socket) {
  
    saveSession(socket.handshake.auth.token, {userId:socket.user_id, email:socket.email,connected:socket.connected })
    let users = [];
    getSessions().forEach(element => {
      if (element.userId != socket.user_id)
      users.push({userId: element.userId, email:element.email,connected:element.connected })
    });
  

    socket.emit("users",users);

    socket.broadcast.emit("new user",{
      userId: socket.user_id,
      email:socket.email,
      connected:socket.connected
    })

    socket.on('room created',(room)=>{
      io.sockets.emit("get room",room);
    });

    socket.on('room updated',(room)=>{
      socket.broadcast.emit("get room updated",room);
    });

    socket.on('join',(room)=>{
      io.sockets.emit('update count user room join',room);
      socket.join(room);
      socket.room = room;
    })

    socket.on('message room',({message,room}) => {
      io.to(room).emit("message room",{
        client: socket.user_id,
        email: socket.email,
        content: message
      })
    })

    socket.on("quit",(room) =>{
      io.sockets.emit('update count user room leave',room);
      socket.leave(room);
      socket.room = null;
    })


    socket.on('disconnect', () => {
      socket.broadcast.emit('user disconnected',{
        userId: socket.user_id,
        email:socket.email,
        connected:false
      })

      // User disconnect - leave room and update database.
      if (socket.room != null){

        io.sockets.emit('update count user room leave',socket.room);
        socket.leave(socket.room);

        RoomUser.destroy({
          where: {
            roomid: socket.room,
            userid: socket.user_id,
          },
        });

        socket.room = null;
      }

      
    });
});

http.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
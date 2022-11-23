const express = require("express");
const port = process.env.PORT || 3000;
const cors = require('cors');
const {Server} = require("socket.io");
const {createServer} = require("http");
const jwt = require("jsonwebtoken");


const SecurityRouter = require("./routes/Security");
const AdminRouter = require("./routes/Admin");

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

app.get("/", (req, res, next) => {
    res.send("Hello world!");
});

// io.use(async(socket, next) => {
//   if (socket.handshake.auth && socket.handshake.auth.token){
//     const token = socket.handshake.auth.token;
//     const payload = await jwt.verify(token, process.env.JWT_SECRET);
//     socket.user_id = payload.id;
//     socket.is_admin = payload.isAdmin;
//     socket.email = payload.email;
//     next();
  
//   }
//   else {
//     next(new Error('Authentication error'));
//   }    
// })
io.on('connection', function(socket) {

    // List users connection
    let users = [];
    for (let [id,socket] of io.of("/").sockets){
      users.push({
        email : socket.email
      })
    }

    socket.emit("users",users);

    socket.on('createRoom',(name)=>{
      socket.broadcast.emit("getRoom",name);
    });
});

http.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
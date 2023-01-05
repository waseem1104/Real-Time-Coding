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

const chatbotTyping = (to,content,is,step) => {
  io.sockets.to(to).emit("chatbot",{
    content: content,
    is: is,
    step: step
  })
}

const dateFormat = (dateToFormat) => {
  let dateSplited = dateToFormat.split('/');
  let newDate = dateSplited[1] + "/" + dateSplited[0] + "/" +dateSplited[2]; 

  return newDate;
}

const ValidDate = (day) => {
  var bitsDays = day.split('/');
  var yDays = bitsDays[2], 
  mDays  = bitsDays[1],
  dDays = bitsDays[0];
  var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
  if (yDays % 400 === 0 || (yDays % 100 !== 0 && yDays % 4 === 0)) {
    daysInMonth[1] = 29;
  }
  return dDays <= daysInMonth[--mDays];
}

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
  
    socket.join(socket.user_id);
    socket.emit("users",users);

    socket.broadcast.emit("new user",{
      userId: socket.user_id,
      email:socket.email,
      connected:socket.connected
    })

    socket.on('room created',(room)=>{
      io.sockets.emit("get room",room);
    }); 


    socket.on('chatbot', ({client,step,message}) => {

      if (step == 0){
        chatbotTyping(client,`Bonjour ${socket.email} ! 1/ Entretien 2/ Informations 3/ Contact 4/ Fin.`,'chatbot',1);
      }

      if (step == 1){
        switch(message){
          case '1':
            chatbotTyping(client,"Année ?",'chatbot',4);
            break;
          case '3':
            chatbotTyping(client,`Qu'avez-vous besoin ? 1/ Email 2/ Numéro de téléphone.`,'chatbot',3);
            break;
          case '4':
            chatbotTyping(client,'Merci et à très bientôt !','chatbot',-1);
            break;
          default:
            chatbotTyping(client,`Bonjour ${socket.email} ! 1/ Entretien 2/ Informations 3/ Contact 4/ Fin.`,'chatbot',1);
        }
      }

      if (step == 3){
        switch(message){
          case '1':
            chatbotTyping(client,'test@test.com.','chatbot',31);
            chatbotTyping(client,'Merci et à très bientôt !','chatbot',-1);
            break;

          case '2':
            chatbotTyping(client,'0102030405','chatbot',31);
            chatbotTyping(client,'Merci et à très bientôt !','chatbot',-1);
            break;

          default:
            chatbotTyping(client,`Qu'avez-vous besoin ? 1/ Email 2/ Numéro de téléphone.`,'chatbot',3);
        }
      }

      if (step == 4){
        if (isNaN(message)){
          chatbotTyping(client,`Erreur au niveau de l'année !`,'chatbot',4);
          chatbotTyping(client,"Année ?",'chatbot',4);
        }else{
          chatbotTyping(client,"Date de dernier entretien du véhicule ? (DD/MM/YYYY)",'chatbot',41);
        }
      }

      if (step == 41){
        if (!ValidDate(message)){
          chatbotTyping(client,"Erreur",'chatbot',41);
          chatbotTyping(client,"Date de dernier entretien du véhicule ? (DD/MM/YYYY)",'chatbot',41);
        }
        else{
          // socket.lastyear = message;
          let newDate = new Date(dateFormat(message));
          if (newDate.setMonth(newDate.getMonth()+12) < new Date() ){
            chatbotTyping(client,"Nombre de KM parcourus depuis le dernier entretien ?",'chatbot',42);
          }else{


            // DISPO

          }
        }
      }

      if (step == 42){
        if (isNaN(message)){
          chatbotTyping(client,"Erreur ! Nombre de KM parcourus depuis le dernier entretien ?",'chatbot',42);
        }else{
          if (message >= 10000 ){

          }else{
            chatbotTyping(client,"Souhaitez-vous réviser votre véhicule ? 1/ Oui 2/ Non.",'chatbot',43);
          }
        }
      }

      if (step == 43){
        switch(message){
          case '1':
            break;
          case "2":
            chatbotTyping(client,'Merci et à très bientôt !','chatbot',-1);
            chatbotTyping(client,`Bonjour ${socket.email} ! 1/ Entretien 2/ Informations 3/ Contact 4/ Fin.`,'chatbot',1);
            break;
          default:
            chatbotTyping(client,"Souhaitez-vous réviser votre véhicule ? 1/ Oui 2/ Non.",'chatbot',43);
        }
      }


      
    })

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
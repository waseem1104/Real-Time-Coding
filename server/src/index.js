const express = require("express");
const port = process.env.PORT || 3000;
const cors = require('cors');
const {Server} = require("socket.io");
const {createServer} = require("http");
const jwt = require("jsonwebtoken");
const {RoomUser} = require("./models/postgres");
const {Planning} = require("./models/postgres");
const connection = require("./models/postgres/db");
const {QueryTypes} = require("sequelize");
const moment = require('moment');
const SecurityRouter = require("./routes/Security");
const AdminRouter = require("./routes/Admin");
const RoomRouter = require("./routes/Room");
const UserRouter = require("./routes/User");
const ChatRouter = require("./routes/Chat");
const checkAuthentication = require("./middlewares/checkAuthentication");
const checkIsAdmin = require("./middlewares/checkIsAdmin");
const RequestRouter = require("./routes/Request");
const MessageRouter = require("./routes/Messages");


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
app.use("/admin", checkIsAdmin, AdminRouter);
app.use("/room", checkAuthentication, RoomRouter);
app.use("/user", checkAuthentication, UserRouter);
app.use("/chat", checkAuthentication, ChatRouter);
app.use("/request", checkAuthentication, RequestRouter);
app.use("/message", checkAuthentication, MessageRouter);

app.get('/', (req, res) => {
    console.log('Client connected')
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Access-Control-Allow-Origin', '*')

    const intervalId = setInterval(() => {
        const date = new Date().toLocaleString()
        res.write(`data: ${date}\n\n`)
    }, 10000);

    res.on('close', () => {
        console.log('Client closed connection')
        clearInterval(intervalId)
        res.end()
    })
})

// NOTIFICATION - SSE
//---------------------------------
// app.get('/status', (request, response) => response.json({clients: clients.length}));

// let clients = [];
// let facts = [];

// function eventsHandler(request, response, next) {
//     const headers = {
//         'Content-Type': 'text/event-stream',
//         'Connection': 'keep-alive',
//         'Cache-Control': 'no-cache'
//     };
//     response.writeHead(200, headers);

//     const data = `data: ${JSON.stringify(facts)}\n\n`;

//     response.write(data);

//     const clientId = Date.now();

//     const newClient = {
//         id: clientId,
//         response
//     };

//     clients.push(newClient);

//     request.on('close', () => {
//         console.log(`${clientId} Connection closed`);
//         facts = [];
//         clients = clients.filter(client => client.id !== clientId);
//     });
// }

// app.get('/events', eventsHandler);

// function sendEventsToAll(newFact) {
//     clients.forEach(client => client.response.write(`data: ${JSON.stringify(newFact)}\n\n`))
// }

// async function addFact(request, res, next) {
//     const newFact = request.body;
//     facts.push(newFact);
//     setInterval(() => {
//         facts.pop();
//     }, 10000);
//     res.json(newFact)
//     return sendEventsToAll(newFact);
// }

// app.post('/fact', addFact);

const chatbotTyping = (
    to, content, is, step
) => {
    io.sockets.to(to).emit("chatbot", {
        content: content,
        is: is,
        step: step
    })
}

const dateFormat = (dateToFormat) => {
    let dateSplited = dateToFormat.split('/');
    let newDate = dateSplited[1] + "/" + dateSplited[0] + "/" + dateSplited[2];

    return newDate;
}


const getDatesDb = async (status = 0) => {
    let datesDb = [];
    let dates = [];
    let date = moment();
    do {

        dates = [];
        datesDb = [];

        for (let i = 1; i <= 7; i++) {
            let newDate = date.day(i);
            dates.push(newDate.format('YYYY-MM-DD'));
        }

        const result = await connection.query(
            `SELECT date
             FROM plannings
             WHERE date BETWEEN '${dates[0]}' AND '${dates[6]}' AND status = ${status}`,
            {
                type: QueryTypes.SELECT,
            }
        );


        for (let i in result) {
            datesDb.push(result[i].date);
        }

        date.add(1, 'days');
        dates = dates.filter(d => d > moment().format("YYYY-MM-DD"));
        dates = dates.filter(d => !datesDb.includes(d));

    } while (dates.length == 0);

    return dates;
}


const ValidDate = (day) => {
    var bitsDays = day.split('/');
    var yDays = bitsDays[2],
        mDays = bitsDays[1],
        dDays = bitsDays[0];
    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (yDays % 400 === 0 || (yDays % 100 !== 0 && yDays % 4 === 0)) {
        daysInMonth[1] = 29;
    }
    return dDays <= daysInMonth[--mDays];
}

const sessions = new Map();

const saveSession = (id, session) => {
    sessions.set(id, session);
}
const getSessions = () => {
    return [...sessions.values()];
}

let type = 0

io.use(async (socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {

        const token = socket.handshake.auth.token;
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        socket.user_id = payload.id;
        socket.is_admin = payload.isAdmin;
        socket.email = payload.email;
        socket.connected = true;
        socket.available = true;
        next();

    } else {
        next(new Error('Authentication error'));
    }
})
io.on('connection', function (socket) {

    saveSession(socket.user_id, {
        userId: socket.user_id,
        email: socket.email,
        admin: socket.is_admin,
        connected: socket.connected,
        available: socket.available
    })
    let users = [];
    let conseillers = [];

    getSessions().forEach(element => {
        if (element.userId != socket.user_id) {
            users.push({
                userId: element.userId,
                email: element.email,
                connected: element.connected,
                admin: element.admin,
                available: element.available
            })
        }
        conseillers.push({
            userId: element.userId,
            email: element.email,
            connected: element.connected,
            admin: element.admin,
            available: element.available
        })
    });

    socket.join(socket.user_id);
    socket.emit("users", users);

    socket.broadcast.emit("new user", {
        userId: socket.user_id,
        email: socket.email,
        connected: socket.connected,
        admin: socket.is_admin,
        available: socket.available
    })

    socket.on('get conseillers', () => {
        socket.emit("get conseillers", conseillers);
    });

    socket.broadcast.emit("new conseiller", conseillers)

    socket.on('get available', () => {
        socket.emit("get available", socket.available);
    });

    socket.on('update available', (available) => {
        socket.available = available;
        let found = conseillers.findIndex((element) => element.userId == socket.user_id);
        if (found != -1) {
            conseillers[found].available = available
        }
        saveSession(socket.user_id, {
            userId: socket.user_id,
            email: socket.email,
            admin: socket.is_admin,
            connected: socket.connected,
            available: available
        })

        socket.broadcast.emit('update conseillers', conseillers);
    })

    socket.on('room created', (room) => {
        io.sockets.emit("get room", room);
    });

    socket.on('room deleted', (room) => {
        socket.broadcast.emit("room deleted", room);
    });

    socket.on('public message', ({content, dateCreated}) => {
        io.sockets.emit('public message',
            {
                content: content,
                email: socket.email,
                createdAt: dateCreated
            })
    })

    socket.on('private message', ({content, dateCreated, to}) => {
        socket.to(to).emit("private message",
            {
                content: content,
                createdAt: dateCreated
            })
    })

    socket.on('chatbot', async ({client, step, message}) => {

        if (step == 0) {
            chatbotTyping(client, `Bonjour ${socket.email} ! 1/ Entretien 2/ Informations 3/ Contact 4/ Fin.`, 'chatbot', 1);
        }

        if (step == 1) {
            switch (message) {
                case '1':
                    type = 0;
                    chatbotTyping(client, "Année ?", 'chatbot', 4);
                    break;
                case '2':
                    chatbotTyping(client, "Type d'usage ? 1/ Usage routier 2/ Usage tout-terrain 3/ Usage sportif.", 'chatbot', 2);
                    break;
                case '3':
                    chatbotTyping(client, `Qu'avez-vous besoin ? 1/ Email 2/ Numéro de téléphone.`, 'chatbot', 3);
                    break;
                case '4':
                    chatbotTyping(client, 'Merci et à très bientôt !', 'chatbot', -1);
                    break;
                default:
                    chatbotTyping(client, `Bonjour ${socket.email} ! 1/ Entretien 2/ Informations 3/ Contact 4/ Fin.`, 'chatbot', 1);
            }
        }

        if (step == 2) {
            switch (message) {
                case '1':
                    type = 1;
                    getDatesDb(type).then((res) => {
                        chatbotTyping(client, `Choisissez une date pour un essai routier : ${res.join(" | ")} `, 'chatbot', 44);
                    })
                    break;
                case '2':
                    type = 2;
                    getDatesDb(type).then((res) => {
                        chatbotTyping(client, `Choisissez une date pour un essai tout-terrain : ${res.join(" | ")} `, 'chatbot', 44);
                    })
                    break;
                case '3':
                    type = 3;
                    getDatesDb(type).then((res) => {
                        chatbotTyping(client, `Choisissez une date pour un essai sportif : ${res.join(" | ")} `, 'chatbot', 44);
                    })
                    break;
                default:
                    chatbotTyping(client, "Type d'usage ? 1/ Usage routier 2/ Usage tout-terrain 3/ Usage sportif.", 'chatbot', 2);
            }
        }

        if (step == 3) {
            switch (message) {
                case '1':
                    chatbotTyping(client, 'test@test.com.', 'chatbot', 31);
                    chatbotTyping(client, 'Merci et à très bientôt !', 'chatbot', -1);
                    break;

                case '2':
                    chatbotTyping(client, '0102030405', 'chatbot', 31);
                    chatbotTyping(client, 'Merci et à très bientôt !', 'chatbot', -1);
                    break;

                default:
                    chatbotTyping(client, `Qu'avez-vous besoin ? 1/ Email 2/ Numéro de téléphone.`, 'chatbot', 3);
            }
        }

        if (step == 4) {
            if (isNaN(message)) {
                chatbotTyping(client, `Erreur au niveau de l'année !`, 'chatbot', 4);
                chatbotTyping(client, "Année ?", 'chatbot', 4);
            } else {
                chatbotTyping(client, "Date de dernier entretien du véhicule ? (DD/MM/YYYY)", 'chatbot', 41);
            }
        }

        if (step == 41) {
            if (!ValidDate(message)) {
                chatbotTyping(client, "Erreur", 'chatbot', 41);
                chatbotTyping(client, "Date de dernier entretien du véhicule ? (DD/MM/YYYY)", 'chatbot', 41);
            } else {
                let newDate = new Date(dateFormat(message));
                if (newDate.setMonth(newDate.getMonth() + 12) < new Date()) {
                    chatbotTyping(client, "Nombre de KM parcourus depuis le dernier entretien ?", 'chatbot', 42);
                } else {

                    getDatesDb().then((res) => {
                        chatbotTyping(client, `Choisissez une date : ${res.join(" | ")} `, 'chatbot', 44);
                    })

                }
            }
        }

        if (step == 42) {
            if (isNaN(message)) {
                chatbotTyping(client, "Erreur ! Nombre de KM parcourus depuis le dernier entretien ?", 'chatbot', 42);
            } else {
                if (message >= 10000) {
                    getDatesDb().then((res) => {
                        chatbotTyping(client, `Choisissez une date : ${res.join(" | ")} `, 'chatbot', 44);
                    })
                } else {
                    chatbotTyping(client, "Souhaitez-vous réviser votre véhicule ? 1/ Oui 2/ Non.", 'chatbot', 43);
                }
            }
        }

        if (step == 43) {
            switch (message) {
                case '1':
                    getDatesDb().then((res) => {
                        chatbotTyping(client, `Choisissez une date : ${res.join(" | ")} `, 'chatbot', 44);
                    })
                    break;
                case "2":
                    chatbotTyping(client, 'Merci et à très bientôt !', 'chatbot', -1);
                    chatbotTyping(client, `Bonjour ${socket.email} ! 1/ Entretien 2/ Informations 3/ Contact 4/ Fin.`, 'chatbot', 1);
                    break;
                default:
                    chatbotTyping(client, "Souhaitez-vous réviser votre véhicule ? 1/ Oui 2/ Non.", 'chatbot', 43);
            }
        }


        if (step == 44) {
            getDatesDb(type).then(async (res) => {
                if (res.includes(message)) {
                    const result = await connection.query(
                        `SELECT id
                         FROM plannings
                         WHERE date = '${message}' AND status = ${type}`, {type: QueryTypes.SELECT,});

                    if (result.length == 0) {
                        const planning = await Planning.create({date: message, status: type, userId: socket.user_id});
                        chatbotTyping(client, `Votre date s'est bien enregistrée !`, 'chatbot', -1);
                        chatbotTyping(client, `1/ Entretien 2/ Informations 3/ Contact 4/ Fin.`, 'chatbot', 1);
                    } else {
                        chatbotTyping(client, `Choisissez une date parmis les dates suivantes : ${res.join(" | ")} `, 'chatbot', 44);
                    }

                } else {
                    chatbotTyping(client, `Choisissez une date parmis les dates suivantes : ${res.join(" | ")} `, 'chatbot', 44);
                }
            })
        }

    })

    socket.on('room updated', (room) => {
        socket.broadcast.emit("get room updated", room);
    });

    socket.on('join', (room) => {
        io.sockets.emit('update count user room join', room);
        socket.join(room);
        socket.room = room;
    })

    socket.on('message room', ({message, room}) => {
        io.to(room).emit("message room", {
            client: socket.user_id,
            email: socket.email,
            content: message
        })
    })

    socket.on("quit", (room) => {
        io.sockets.emit('update count user room leave', room);
        socket.leave(room);
        socket.room = null;
    })

    //REQUEST

    socket.on('new request', (request) => {
        io.sockets.emit("new request", request);
    });

    socket.on('refuse request', (request) => {
        socket.to(request.userid).emit("refuse request", {
            request
        });
    })

    socket.on('accept request:user', (req) => {
        socket.to(req.userid).emit("accept request:user", {
            req
        });
    })

    socket.on('accept request', (req) => {
        socket.broadcast.emit('accept request', req);
    })

    socket.on('close request', (req) => {
        socket.to(req.userid).emit("close request", {
            req
        });
    })

    socket.on('disconnect', () => {

        saveSession(socket.user_id, {
            userId: socket.user_id,
            email: socket.email,
            admin: socket.is_admin,
            connected: false,
            available: false
        })

        let found = conseillers.findIndex((element) => element.userId == socket.user_id);
        if (found != -1)
            conseillers[found].available = false

        socket.broadcast.emit("conseiller disconnected", conseillers)


        socket.broadcast.emit('user disconnected', {
            userId: socket.user_id,
            email: socket.email,
            connected: false,
            available: false
        })

        // User disconnect - leave room and update database.
        if (socket.room != null) {
            io.sockets.emit('update count user room leave', socket.room);
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
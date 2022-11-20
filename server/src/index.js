const express = require("express");
const port = process.env.PORT || 3000;
const cors = require('cors');
const {Server} = require("socket.io");
const {createServer} = require("http");
const corsOption = {
    origin: ['http://localhost:3000'],
};

const app = express();
const http = createServer(app);
const SecurityRouter = require("./routes/Security");

const io = new Server(
    http,
    {
        cors: corsOption,
    }
);

app.use(express.json());
app.use(cors(corsOption));
app.use(SecurityRouter);

app.get("/", (req, res, next) => {
    res.send("Hello world!");
});

io.on('connection', function (socket) {

    console.log('User Connected');

    socket.on('Disconnect', () => {
        console.log('User Disconnected')
    })

    socket.on("credentials", cred => {
        console.log(cred)
    })
})


http.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
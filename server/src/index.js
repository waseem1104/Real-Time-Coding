const express = require("express");
const port = process.env.PORT || 3000;
const { createServer } = require("http");
const app = express();
const cors = require('cors');
const { Server } = require("socket.io");
app.use(express.json());
const corsOption = {
  origin: ['http://localhost:3000'],
};
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
app.use(cors(corsOption));

app.get("/", (req, res, next) => {
  res.send("Hello world!");
});

io.on('connection', function(socket) {
  //Alerts us when someone successfully connects
      console.log('User Connected');
      //Alerts us when someone disconnects
      socket.on('Disconnect', () => {
          console.log('User Disconnected')
      })
  })

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
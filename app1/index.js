const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { createAdapter } = require('@socket.io/redis-adapter') 
const { createClient } = require( "redis");

const io = new Server(server);


const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

pubClient.on("error", (err) => {
  console.log(err.message);
});

subClient.on("error", (err) => {
  console.log(err.message);
});

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    server.listen(3723, () => {
        console.log("listening on : 3723");
    });
});


io.on("connection", (socket) => {
  console.log("a user connected 3723");
  socket.join('room','3723 joined room');

  socket.on('check',() => {
    console.log('3723 check');
    io.to("room").emit("check", "check 3723");
  })
});


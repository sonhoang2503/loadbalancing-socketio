const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { Redis} = require('ioredis')

const io = new Server(server);

const pubClient = new Redis(
  {
    host: "localhost",
    port: 6379,
  },
);

const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

// pubClient.on("error", (err) => {
//     console.log('pub',err.message);
//   });
  
//   subClient.on("error", (err) => {
//     console.log('sub',err.message);
//   });

server.listen(3720, () => {
  console.log("listening on : 3720");
});

io.on("connection", (socket) => {
  console.log("a user connected 3720");
  socket.join("room", "3720 joined room");

  socket.on("check", () => {
    console.log("3720 check");
    io.to("room").emit("check", "check 3720");
  });
});

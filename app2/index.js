const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const { Server } = require("socket.io");

const io = new Server(server);

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  server.listen(3720, () => {
    console.log("listening on : 3720");
  });
});

io.on("connection", (socket) => {
  console.log("a user connected 3720");
  socket.join("room", "3720 joined room");

  socket.on("check", () => {
    console.log("3720 check");
    io.to("room").emit("check", "check 3720");
  });
});

// io.on("check", (socket) => {
//   console.log('3720 check');
//   io.to("room").emit("check", "check 3720");
// });

import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 2766;
const hostName = "127.0.0.1";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(cors());
function readDataFromFile() {
  try {
    if (!fs.existsSync("dbstore.txt")) {
      fs.writeFileSync("dbstore.txt", "[]", "utf8");
      return [];
    }
    const data = fs.readFileSync("dbstore.txt", "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading data from file:", err);
    return [];
  }
}
function writeDataToFile(data) {
  try {
    fs.writeFileSync("dbstore.txt", JSON.stringify(data));
  } catch (err) {
    console.error("Error writing data to file:", err);
  }
}
app.get("/", (req, res) => {
  res.send("<h1>Server started SocketIo</h1>");
});
io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("message", ({ room, messsage }) => {
    console.log({ room, messsage });
    io.to(room).emit("msg_recieved", messsage);
    const newMessage = { room, messsage, timestamp: new Date().toISOString() };
    let messages = readDataFromFile();
    messages.push(newMessage);
    writeDataToFile(messages);
  });

  //  console.log("user connected", socket.id);
  //  socket.emit("welcome", welcome to my server ${socket.id});
});
io.on("disconnect", () => {
  console.log("user disconnected", socket.id);
});

server.listen(PORT, hostName, () => {
  console.log(`server started at http://${hostName}:${PORT}`);
});

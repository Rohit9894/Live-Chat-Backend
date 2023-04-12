require("dotenv").config();
const express = require("express");
const connect = require("./config/db");
const color = require("colors");
const cors = require("cors");
const app = express();
const userRoute = require("./features/Routes/userRoutes");
const chatRoute = require("./features/Routes/chatRoutes");
const messageRoute = require("./features/Routes/messageRoutes");
const userModel = require("./features/models/userModel");
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/message", messageRoute);

app.get("/", (req, res) => {
  res.send("Hello what are you doin");
});
// app.use(notFound);
// app.use(errHandler);
const server = app.listen(5000, async () => {
  await connect();
  console.log("http://localhost:5000".blue.italic);
});

const io = require("socket.io")(server, {
  pingTimeout: 6000,
  cors: {
    origin: "*",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("setup", async (userData) => {
    socket.join(userData.userId);

    const userr = await userModel.findByIdAndUpdate(userData.userId, {
      status: true,
    });
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  // socket.off("setup", () => {
  //   console.log("USER DISCONNECTED");
  //   socket.leave(userData._id);
  // });
  socket.on("disconnect", () => {
    socket.broadcast.emit("disc", "world");
  });
  socket.on("mama", async (data) => {
    const userr = await userModel.findByIdAndUpdate(data.userId, {
      status: false,
    });
  });
});

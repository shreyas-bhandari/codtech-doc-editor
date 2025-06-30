require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const Document = require("./models/Document");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const findOrCreateDocument = async (id) => {
  if (!id) return;

  let document = await Document.findById(id);
  if (!document) {
    document = await Document.create({ _id: id }); // no need to pass content now
  }
  return document;
};



io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.content);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { content: data });
    });
  });
});

const parsedPort = parseInt(process.env.PORT, 10);
const PORT = !isNaN(parsedPort) ? parsedPort : 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

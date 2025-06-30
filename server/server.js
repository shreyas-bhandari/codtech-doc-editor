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

// Connect MongoDB
connectDB();

// HTTP & Socket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 🔧 Helper: create or fetch document
const findOrCreateDocument = async (id) => {
  if (!id) return;

  let document = await Document.findById(id);
  if (!document) {
    document = await Document.create({ _id: id }); // content defaults to ""
  }
  return document;
};

// ⚡ Real-time Socket.IO logic
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);

    // Join the room for this document
    socket.join(documentId);
    console.log(`📄 Socket ${socket.id} joined room: ${documentId}`);

    // Send document content to this socket
    socket.emit("load-document", document.content);

    // Broadcast changes to others in the room
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    // Save the document to DB
    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { content: data });
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// 🌍 Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});

const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

const documentId = "test-doc-123";

socket.on("connect", () => {
  console.log("Connected to server with id:", socket.id);

  // Request document
  socket.emit("get-document", documentId);

  // Listen for document load
  socket.once("load-document", (doc) => {
    console.log("Document loaded:", doc);

    // Simulate sending changes
    const newContent = doc + " Updated content.";
    socket.emit("send-changes", newContent);

    // Save document
    socket.emit("save-document", newContent);

    // Disconnect after test
    setTimeout(() => {
      socket.disconnect();
      console.log("Disconnected from server");
    }, 1000);
  });

  socket.once("load-document-error", () => {
    console.error("Error loading document");
    socket.disconnect();
  });
});

socket.on("receive-changes", (delta) => {
  console.log("Received changes:", delta);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err);
});

import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER = "http://localhost:5000";

function Editor({ documentId }) {
  const socketRef = useRef();
  const [content, setContent] = useState("");

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER);
    socketRef.current.emit("get-document", documentId);

    socketRef.current.once("load-document", (docContent) => {
      setContent(docContent);
    });

    return () => socketRef.current.disconnect();
  }, [documentId]);

  useEffect(() => {
    if (!socketRef.current) return;
    const handleReceive = (newContent) => {
      setContent(newContent);
    };
    socketRef.current.on("receive-changes", handleReceive);
    return () => {
      socketRef.current.off("receive-changes", handleReceive);
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);
    socketRef.current.emit("send-changes", value);
    socketRef.current.emit("save-document", value);
  };

  return (
    <textarea
      value={content}
      onChange={handleChange}
      className="editor-textarea"
    />
  );
}

export default Editor;
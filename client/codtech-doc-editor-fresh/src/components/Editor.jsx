import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { debounce } from "lodash";

const socket = io("http://localhost:5000");

function Editor({ documentId }) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const textRef = useRef(null);

  // Load the doc on mount
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    socket.emit("get-document", documentId);

    socket.once("load-document", (doc) => {
      setContent(doc);
      setIsLoading(false);
      setIsError(false);
    });

    return () => socket.disconnect();
  }, [documentId]);

  // Broadcast changes to others
  useEffect(() => {
    const handler = (delta) => {
      setContent(delta);
    };

    socket.on("receive-changes", handler);

    // Connection status handlers
    const onConnect = () => {
      setIsConnected(true);
      setIsError(false);
    };
    const onDisconnect = () => {
      setIsConnected(false);
      setIsError(true);
      setIsLoading(false);
    };
    const onConnectError = () => {
      setIsConnected(false);
      setIsError(true);
      setIsLoading(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("receive-changes", handler);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, []);

  // Send changes when typing
  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);
    socket.emit("send-changes", value);
    saveContent(value);
  };

  // Save to backend with debounce
  const saveContent = debounce((data) => {
    socket.emit("save-document", data);
  }, 1000);

  if (isLoading) {
    return <div className="text-white text-center mt-10">Loading document...</div>;
  }

  if (isError) {
    return <div className="text-red-500 text-center mt-10">Error connecting to the document server. Please try again later.</div>;
  }

  return (
    <textarea
      ref={textRef}
      value={content}
      onChange={handleChange}
      placeholder="Start typing here..."
      className="w-full h-[70vh] p-4 rounded-lg bg-white text-black focus:outline-none text-lg shadow-md"
    />
  );
}

export default Editor;

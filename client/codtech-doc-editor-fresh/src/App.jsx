import React from "react";
import Editor from "./components/Editor";

function App() {
  const docId = "codtech-task-3"; // You can make this dynamic

  return (
    <div className="bg-gray-950 min-h-screen p-4 text-white">
      <h1 className="text-center text-orange-400 text-3xl font-bold mb-4">
        📝 CodTech Realtime Doc Editor
      </h1>
      <Editor documentId={docId} />
    </div>
  );
}

export default App;

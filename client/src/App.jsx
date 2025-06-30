import React from "react";
import Editor from "./Editor";

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>CodTech Realtime Editor</h1>
      <Editor documentId="codtech-doc" />
    </div>
  );
}

export default App;

import React, { useState } from "react";
import Editor from "./Editor";
import Login from "./Login";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  return (
    <div className="app-container">
      {user ? (
        <>
          <h1>CodTech Realtime Editor</h1>
          <p className="user-welcome">Welcome, {user}!</p>
          <Editor documentId="codtech-doc" />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

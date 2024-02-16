import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const socket = useMemo(() => io("http://127.0.0.1:2766"), []);
  const [messsage, setmessage] = useState("");
  const [room, setroom] = useState("");
  const [socketId, setsocketId] = useState("");
  const [messages, setMessages] = useState([]);

  const submithandler = (e) => {
    e.preventDefault();
    socket.emit("message", { messsage, room });
    setmessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setsocketId(socket.id);
      console.log("connected", socket.id);
    });
    socket.on("msg_recieved", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <h1>Socket.Io Connected</h1>
      <h1 style={{ color: "green" }}>
        Socket.ID=><span style={{ color: "red" }}>{socketId}</span>
      </h1>
      <form onSubmit={submithandler}>
        <input
          type="text"
          name=""
          placeholder="Message"
          value={messsage}
          onChange={(e) => setmessage(e.target.value)}
          id=""
        />
        <input
          type="text"
          name=""
          placeholder="room"
          value={room}
          onChange={(e) => setroom(e.target.value)}
          id=""
        />
        <button type="submit">Send</button>
      </form>
      <div>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              padding: "0.2rem",
              margin: "0.5rem",
              backgroundColor: "gray",
            }}
          >
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;

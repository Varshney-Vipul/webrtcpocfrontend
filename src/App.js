import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
//import WebRTCConnector from "./components/webrtcconnector.component";
import Lobby from "./components/lobby.component";
const App = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io("ws://webrtcpoc26.herokuapp.com");
    setSocket(newSocket);

    return () => newSocket.close();
  }, [setSocket]);
  return (
    <div>
      this is a websocket app!
      {socket && <Lobby socket={socket} />}
    </div>
  );
};

export default App;

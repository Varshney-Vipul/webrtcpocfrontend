import React from "react";
import { useState, useEffect } from "react";
import WebRTCConnector from "./webrtcconnector.component";

const Lobby = ({ socket }) => {
  const [lobbyDetails, setLobbyDetails] = useState(null);
  const [peerRole, setPeerRole] = useState(null);

  const fetchLobbyDetails = () => {
    console.log("fetching lobby details");
    socket.emit("fetch-lobby-details");
  };

  useEffect(() => {
    socket.on("lobby-details", (data) => {
      if (data.success) {
        console.log(data);
        setLobbyDetails(data.lobbyDetails);
        setPeerRole(data.role);
      } else {
      }
    });
  }, [socket]);

  return (
    <div>
      This is lobby!
      <button onClick={fetchLobbyDetails}>Play!</button>
      {peerRole && <WebRTCConnector socket={socket} role={peerRole} />}
    </div>
  );
};

export default Lobby;

import React, { useRef } from "react";
import { useState, useEffect } from "react";

// in a webrtc p2p connection , one peer is calling peer and other peer is receiving peer
// calling peer creates a local offer and shares it while receiving peer creates an answer with this received offer and shares it with calling peer
// here we need to check whether we are receiving peer or calling peer

const WebRTCConnector = ({ socket, role }) => {
  // const [iceCandidates, setIceCandidates] = useState([]);
  //const [remoteIceCandidates, setRemoteIceCandidates] = useState([]);
  //const [localDescription, setLocalDescription] = useState(null);
  //  const [remoteDescription, setRemoteDescription] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  const npConnection = useRef(null);
  useEffect(() => {
    console.log(npConnection.current);
  });
  const [chatList, setChatList] = useState([]);
  const peerConfiguration = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19032",
      },
    ],
  };

  function createWebRTC() {
    var lp = new RTCPeerConnection();
    lp.onicecandidate = (e) => console.log("got myself an ice candidate ! ");
    const dc = lp.createDataChannel("test124");
    //var offer = await lp.createOffer();
    //await lp.setLocalDescription(offer);

    lp.createOffer()
      .then((offer) => lp.setLocalDescription(offer))
      .then(() => {
        socket.emit("peer-offer", lp.localDescription);
        // setPeerConnection(lp);
        npConnection.current = lp;
      });
  }
  useEffect(() => {
    // initSocketEvents();
    createWebRTC();
  }, [socket]);
  return (
    <div>
      this is a webRTCConnector!!
      <input type="text"></input>
      <button> send chat</button>
      {chatList.map((chat) => {
        <p>{chat}</p>;
      })}
    </div>
  );
};

export default WebRTCConnector;

// async function createPeerConnection() {
//   console.log("creating peer connection");
//   const pConnection = await new RTCPeerConnection(peerConfiguration);
//   pConnection.addEventListener("icecandidate", (event) => {
//     console.log("adding local ice candidate : " + event.candidate);
//     if (event.candidate) {
//       socket.emit("peer-ice-candidate", { iceCandidate: event.candidate });
//     }
//   });

//   pConnection.addEventListener("connectionstatechange", (event) => {
//     if (pConnection.connectionState === "connected") {
//       console.log("peers are connected");
//     }
//   });

//   console.log("local peer connection created ");
//   console.log(pConnection);
//   setPeerConnection(pConnection, () => {
//     console.log("state is initialized");
//   });
//   // initSocketEvents();
// }
// async function initSocketEvents() {
//   socket.on("remote-peer-answer", async (data) => {
//     console.log("remote peer answer received");
//     if (data.answer) {
//       const remoteDescription = RTCSessionDescription(data.answer);
//       await peerConnection.setRemoteDescription(remoteDescription);
//     }
//   });
//   socket.on("remote-peer-offer", async (data) => {
//     console.log("remote peer offer received");
//     if (data.offer) {
//       await peerConnection.setRemoteDescription(
//         new RTCSessionDescription(data.offer)
//       );
//       const answer = await peerConnection.createAnswer();
//       await peerConnection.setLocalDescription(answer);
//       socket.emit("peer-answer", { answer: answer });
//     }
//   });

//   socket.on("remote-peer-ice-candidate", async (data) => {
//     console.log("adding remote ice candidate : " + data.iceCandidate);
//     if (data.iceCandidate) {
//       await peerConnection.addIceCandidate(data.iceCandidate);
//     }
//   });

//   socket.on("lobby-member-count", async (data) => {
//     if (data.memCount === 2) {
//       await createPeerConnection();
//       socket.emit("peer-connection-created", {
//         peerConnection: peerConnection,
//       });
//     }
//   });

//   socket.on("initiate-offer", () => {
//     console.log("printign peer connection");
//     console.log(peerConnection);
//     //sendOffer();
//   });
// }

// async function sendOffer() {
//   if (!peerConnection) {
//     console.log("peer connection is null ! aborting");
//     return;
//   }
//   if (role === "caller") {
//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);
//     socket.emit("peer-offer", { offer: offer });
//   }
// }

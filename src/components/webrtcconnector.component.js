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
  // const [peerConnection, setPeerConnection] = useState(null);
  const peerConnection = useRef(null);

  const dataChannel = useRef(null);
  const channelName = "sldhfkshf";
  // const npConnection = useRef(null);
  useEffect(() => {
    console.log("logging peer connection ");
    // console.log(peerConnection);
    console.log(peerConnection.current);
  });
  const [chatList, setChatList] = useState([]);
  const peerConfiguration = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19032",
      },
    ],
  };

  async function createWebRTC() {
    console.log("creating web rtc connection");
    var lp = new RTCPeerConnection();

    lp.onicecandidate = (e) => {
      console.log(e);
      socket.emit("peer-ice-candidate", { candidate: e.candidate });
    };
    //  const dc = lp.createDataChannel(channelName);

    if (role === "caller") {
      console.log("creating offer");
      dataChannel.current = lp.createDataChannel(channelName);
      dataChannel.current.onopen = (e) => console.log("data channel opened");
      var offer = await lp.createOffer();
      await lp.setLocalDescription(offer);
      socket.emit("peer-offer", {
        offer: lp.localDescription,
        channelName: channelName,
      });
    }

    // setPeerConnection(lp);
    peerConnection.current = lp;

    //   dc.onopen = (e) => {
    //      console.log("Data channel opened");
    //   };
    //var offer = await lp.createOffer();
    //await lp.setLocalDescription(offer);

    // lp.createOffer()
    //   .then((offer) => lp.setLocalDescription(offer))
    //   .then(() => {
    //     socket.emit("peer-offer", {
    //       offer: lp.localDescription,
    //       channelName: channelName,
    //     });
    //     // setPeerConnection(lp);
    //     npConnection.current = lp;
    //   });
  }

  function initSocketEvents() {
    socket.on("remote-peer-offer", async (data) => {
      console.log(peerConnection.current);
      console.log("recevied remote offer");
      console.log(data.offer);
      // const rp = new RTCPeerConnection();

      peerConnection.current.ondatachannel = (e) => {
        console.log("found a data channel in the offer!");
        dataChannel.current = e.channel;
        dataChannel.current.onmessage = (e) =>
          console.log("new message : " + e.data);
        dataChannel.current.onopen = (e) => console.log("connection opened");
      };
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("peer-answer", { answer: answer });
      //setPeerConnection(rp);
    });

    socket.on("lobby-member-count", (data) => {
      if (data.memCount === 2) {
        createWebRTC();
      }
    });

    socket.on("remote-peer-ice-candidate", async (data) => {
      console.log("got a remote ice candidate : " + data.candidate);
      await peerConnection.current.addIceCandidate(data.candidate);
    });

    socket.on("remote-peer-answer", async (data) => {
      console.log("received remote answer");
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      // peerConnection.current.dc =
      //   peerConnection.current.createDataChannel(channelName);
      // peerConnection.current.dc.onopen = (e) =>
      //   console.log("data channel opened");
    });
  }

  useEffect(() => {
    // initSocketEvents();
    //createWebRTC();
  }, [socket]);

  useEffect(() => {
    initSocketEvents();
  }, [socket]);

  return (
    <div>
      this is a webRTCConnector!!
      <input type="text"></input>
      <button onClick={() => dataChannel.current.send("yolo")}>
        {" "}
        send chat
      </button>
      {chatList.map((chat) => {
        <p>{chat}</p>;
      })}
    </div>
  );
};

export default WebRTCConnector;

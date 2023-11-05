import * as io from "socket.io-client";
import store from "../store/store";
import * as meetingActions from "../store/actions/meetingActions";
import * as webRtcHandler from "./webRTC/webRTCHandler";
import * as webRTCGroupCallHandler from "./webRTC/webRTCGroupCallHandler";

const SERVER = "http://localhost:8080";
const broadcastEventTypes = {
  ACTIVE_USERS: "ACTIVE_USERS",
  GROUP_CALL_ROOMS: "GROUP_CALL_ROOMS",
};

export type TUserJoinsGroupCallData = {
  peerId: string;
  hostSocketId: string;
  roomId: string;
  localStreamId: string | null;
};

type TUserLeftGroupCallData = {
  streamId: string
  roomId: string | null,
}

type TWebRTCOfferData = {
  calleeSocketId: string | null;
  offer: RTCSessionDescriptionInit | undefined;
};

type TPreOfferAnswerData = {
  callerSocketId: string | null;
  answer: string;
};

type TWebRTCCandidateData = {
  connectedUserSocketId: string | null;
  candidate: RTCIceCandidate | undefined;
};

type TWebRTCAnswerData = {
  callerSocketId: string | null;
  answer: RTCSessionDescriptionInit | undefined;
};

type TPreOfferData = {
  callee: TUser;
  caller: { username: string };
};

type TGroupCallRegisterData = {
  username: string;
  peerId: string;
};

type TUserHangedUpData = {
  connectedUserSocketId: string | null;
};



let socket: io.Socket;

export const connectionWithWebSocket = () => {
  socket = io.connect(SERVER);

  socket.on("connection", () => {
    console.log("connected to wss server");
    console.log(socket.id);
  });

  socket.on("broadcast", (data: any) => {
    handleBroadcastEvents(data);
  });

  socket.on("pre-offer", (data: TPreOfferData) => {
    console.log("pre-offer received");
    webRtcHandler.handlePreOffer(data);
  });

  socket.on("pre-offer-answer", (data: TPreOfferAnswerData) => {
    webRtcHandler.handlePreOfferAnswer(data);
  });

  socket.on("webRTC-offer", (data: TWebRTCOfferData) => {
    webRtcHandler.handleOffer(data);
  });

  socket.on("webRTC-answer", (data: TWebRTCAnswerData) => {
    webRtcHandler.handleAnswer(data);
  });

  socket.on("webRTC-candidate", (data: TWebRTCCandidateData) => {
    webRtcHandler.handleCandidate(data);
  });

  socket.on("user-hanged-up", () => {
    webRtcHandler.handleUserHangedUp();
  });

  // Listerens related to group calls
  socket.on('group-call-join-request', (data) => {
    webRTCGroupCallHandler.connectToNewUser(data)
  })

  socket.on('group-call-user-left', (data) => {
    webRTCGroupCallHandler.removeInactiveStream(data)
  })
};

export const registerNewUser = (username: string) => {
  socket.emit("register-new-user", {
    username,
    socketId: socket.id,
  });
};

export const sendPreOffer = (data: TPreOfferData) => {
  console.log("sending pre offer");
  socket.emit("pre-offer", data);
};

export const sendPreOfferAnswer = (data: TPreOfferAnswerData) => {
  socket.emit("pre-offer-answer", data);
};

export const sendWebRTCOffer = (data: TWebRTCOfferData) => {
  socket.emit("webRTC-offer", data);
};

export const sendWebRTCAnswer = (data: TWebRTCAnswerData) => {
  socket.emit("webRTC-answer", data);
};

export const sendWebRTCCandidate = (data: TWebRTCCandidateData) => {
  socket.emit("webRTC-candidate", data);
};

export const sendUserHangedUp = (data: TUserHangedUpData) => {
  socket.emit("user-hanged-up", data);
};

export const registerGroupCall = (data: TGroupCallRegisterData) => {
  socket.emit("group-call-register", data);
};

export const userJoinsGroupCall = (data: TUserJoinsGroupCallData) => {
  socket.emit('group-call-join-request', data)
}

export const userLeftGroupCall = (data: TUserLeftGroupCallData) => {
  socket.emit('group-call-user-left', data)
}

export const groupCallClosed = (data: any) => {
  socket.emit('group-call-closed', data)
}

const handleBroadcastEvents = (data: any) => {
  console.log(data);
  switch (data.event) {
    case broadcastEventTypes.ACTIVE_USERS:
      if (!data.activeUsers) {
        console.log("no active users");
        break;
      }
      const activeUsers = data.activeUsers.filter(
        (activeUser: TUser) => activeUser.socketId !== socket.id
      );
      store.dispatch(meetingActions.setActiveUsers(activeUsers));
      break;
    
    case broadcastEventTypes.GROUP_CALL_ROOMS:
      const groupCallRooms = data.groupCallRooms.filter(
        (room: TRoom) => room.socketId !== socket.id
      );
      const activeGroupCallRoomId = webRTCGroupCallHandler.checkActiveGroupCall();
      if(activeGroupCallRoomId) {
        const room = groupCallRooms.find(
          (room: TRoom) => room.roomId === activeGroupCallRoomId
        );
        if(!room) {
          webRTCGroupCallHandler.clearGroupData();
        }
      }
      store.dispatch(meetingActions.setGroupCallRooms(data.groupCallRooms));
      break;

    default:
      break;
  }
};

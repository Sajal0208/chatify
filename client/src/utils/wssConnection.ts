import * as io from "socket.io-client";
import store from "../store/store";
import * as meetingActions from "../store/actions/meetingActions";
import { TUser } from "../types/users";
import * as webRtcHandler from "./webRTC/webRTCHandler";
const SERVER = "http://localhost:8080";

const broadcastEventTypes = {
  ACTIVE_USERS: "ACTIVE_USERS",
  GROUP_CALL_ROOMS: "GROUP_CALL_ROOMS",
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

  socket.on("pre-offer", (data: any) => {
    console.log("pre-offer received");
    webRtcHandler.handlePreOffer(data);
  });

  socket.on("pre-offer-answer", (data: any) => {
    webRtcHandler.handlePreOfferAnswer(data);
  });

  socket.on("webRTC-offer", (data: any) => {
    webRtcHandler.handleOffer(data);
  });

  socket.on("webRTC-answer", (data: any) => {
    webRtcHandler.handleAnswer(data);
  })

  socket.on("webRTC-candidate", (data: any) => {
    webRtcHandler.handleCandidate(data);
  })

  socket.on('user-hanged-up', () => {
    webRtcHandler.handleUserHangedUp();
  })
};

export const registerNewUser = (username: string) => {
  socket.emit("register-new-user", {
    username,
    socketId: socket.id,
  });
};

export const sendPreOffer = (data: any) => {
  console.log("sending pre offer");
  socket.emit("pre-offer", data);
};

export const sendPreOfferAnswer = (data: any) => {
  socket.emit("pre-offer-answer", data);
};

export const sendWebRTCOffer = (data: any) => {
  socket.emit("webRTC-offer", data);
};

export const sendWebRTCAnswer = (data: any) => {
  socket.emit("webRTC-answer", data);
};

export const sendWebRTCCandidate = (data: any) => {
  socket.emit("webRTC-candidate", data);
}

export const sendUserHangedUp = (data: any) => {
  socket.emit("user-hanged-up", data);
}

const handleBroadcastEvents = (data: {
  event: string;
  activeUsers: TUser[];
}) => {
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

    default:
      break;
  }
};

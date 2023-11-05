import Peer from "peerjs";
import store from "../../store/store";
import * as wss from "../wssConnection";
import {
  callStates,
  clearGroupCallData,
  setCallState,
  setGroupCallActive,
  setGroupCallIncomingStreams,
} from "../../store/actions/callActions";

let myPeer: Peer;
let myPeerId: string;
let groupCallRoomId: string | null = null;
let groupCallHost: boolean | null = false;

export const connectWithMyPeer = () => {
  myPeer = new Peer({
    path: "/peerjs",
    host: "/",
    port: 8080,
  });

  myPeer.on("open", (id) => {
    console.log("My peer ID is: " + id);
    myPeerId = id;
  });

  myPeer.on("call", (call) => {
    call.answer(store.getState().call.localStream);
    call.on("stream", (incomingStream) => {
      const streams : MediaStream[] = store.getState().call.groupCallStreams;
      const stream = streams.find(
        (individualStream: MediaStream) => {
          return individualStream.id === incomingStream.id
        }
      );
  
      if (!stream) {
        addVideoStream(incomingStream);
      }
    });
  });
};

export const createNewGroupCall = () => {
  groupCallHost = true;
  wss.registerGroupCall({
    username: store.getState().meeting.username as string,
    peerId: myPeerId,
  });
  store.dispatch(setGroupCallActive(true));
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const joinGroupCall = (hostSocketId: string, roomId: string) => {
  const localStream : MediaStream = store.getState().call.localStream;
  groupCallRoomId = roomId;
  wss.userJoinsGroupCall({
    peerId: myPeerId,
    hostSocketId,
    roomId,
    localStreamId: localStream.id,
  });

  store.dispatch(setGroupCallActive(true));
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const connectToNewUser = (data: any) => {
  const localStream: MediaStream = store.getState().call.localStream;
  const call = myPeer.call(data.peerId, localStream);

  call.on("stream", (incomingStream) => {
    const streams : MediaStream[] = store.getState().call.groupCallStreams;
    console.log("Incoming" + incomingStream);
    console.log("Ours" + localStream);
    const stream = streams.find(
      (individualStream: MediaStream) => {
        return individualStream.id === incomingStream.id
      }
    );

    if (!stream) {
      addVideoStream(incomingStream);
    }
  });
};



export const leaveGroupCall = () => {
  if(groupCallHost) {
    wss.groupCallClosed({ 
      peerId: myPeerId,
    });
  } else {
    wss.userLeftGroupCall({
      streamId: store.getState().call.localStream.id,
      roomId: groupCallRoomId,
    });
  }
  clearGroupData();
}

export const clearGroupData = () => {
  groupCallRoomId = null;
  groupCallHost = null;
  store.dispatch(clearGroupCallData());
  myPeer.destroy();
  connectWithMyPeer();

  const localStream = store.getState().call.localStream;
  if(localStream) {
    localStream.getVideoTracks()[0].enabled = true;
    localStream.getAudioTracks()[0].enabled = true;
  }
}

export const removeInactiveStream = (data: any) => {
  const groupCallStream : MediaStream[] = store.getState().call.groupCallStreams.filter(
    (stream : MediaStream) => stream.id !== data.streamId
  );

  store.dispatch(setGroupCallIncomingStreams(groupCallStream));
}

export const addVideoStream = (incomingStream: MediaStream) => {
  const groupCallStreams = store.getState().call.groupCallStreams;
  const updatedGroupCallStreams = [groupCallStreams, incomingStream];

  store.dispatch(setGroupCallIncomingStreams(updatedGroupCallStreams));
};

// if group call is active, return group call room id
export const checkActiveGroupCall = () => {
  if(store.getState().call.groupCallActive) {
    return groupCallRoomId
  } else {
    return false
  }
}
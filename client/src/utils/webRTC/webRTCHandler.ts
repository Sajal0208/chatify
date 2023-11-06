import {
  callStates,
  resetCallDataState,
  setCallRejected,
  setCallState,
  setCallerUsername,
  setCallingDialogVisible,
  setLocalStream,
  setMessage,
  setRemoteStream,
  setScreenSharingActive,
} from "../../store/actions/callActions";
import store from "../../store/store";
import * as wss from "../wssConnection";

const defaultConstrains = {
  video: {
    width: 192,
    height: 144,
  },
  audio: true,
};

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902",
    },
  ],
};

let connectedUserSocketId: string | null = null;
let peerConnection: RTCPeerConnection | null = null;
let dataChannel: RTCDataChannel | null = null;

const preOfferAnswers = {
  CALL_ACCEPTED: "CALL_ACCEPTED",
  CALL_REJECTED: "CALL_REJECTED",
  CALL_NOT_AVAILABLE: "CALL_NOT_AVAILABLE",
};

export const getLocalStream = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstrains)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
      store.dispatch(setCallState(callStates.CALL_AVAILABLE));
      createPeerConnection();
    })
    .catch((e) => {
      console.log("Error while trying to get local stream");
      console.log(e);
    });
};

export const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration);

  const localStream = store.getState().call.localStream;

  for (const track of localStream.getTracks()) {
    peerConnection.addTrack(track, localStream);
  }

  peerConnection.ontrack = ({ streams: [stream] }) => {
    store.dispatch(setRemoteStream(stream));
  };

  // incoming data channel messages
  peerConnection.ondatachannel = (event) => {
    const dataChannel = event.channel;
    dataChannel.onopen = () => {
      console.log("peer connection is ready to receive data channel messages");
    };

    dataChannel.onmessage = (event) => {
      store.dispatch(setMessage({
        received: true,
        content: event.data
      }));
    }
  }


  dataChannel = peerConnection.createDataChannel("chat");

  dataChannel.onopen = () => {
    console.log("data channel is opened");
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      wss.sendWebRTCCandidate({
        candidate: event.candidate,
        connectedUserSocketId: connectedUserSocketId,
      });
    }
  };

  peerConnection.onconnectionstatechange = (event) => {
    if (peerConnection?.connectionState === "connected") {
      console.log("peers connected");
    }
  };
};

export const callToOtherUser = async (calleeDetails: TUser) => {
  connectedUserSocketId = calleeDetails.socketId;
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
  store.dispatch(setCallingDialogVisible(true));
  const meetingState = store.getState().meeting;
  const username = meetingState.username;
  wss.sendPreOffer({
    callee: calleeDetails,
    caller: {
      username: username,
    },
  });
};

export const handlePreOffer = (data: any) => {
  if (checkIfCallIsPossible()) {
    connectedUserSocketId = data.callerSocketId;
    store.dispatch(setCallerUsername(data.callerUsername));
    store.dispatch(setCallState(callStates.CALL_REQUESTED));
  } else {
    wss.sendPreOfferAnswer({
      callerSocketId: data.callerSocketId,
      answer: preOfferAnswers.CALL_NOT_AVAILABLE,
    });
  }
};

export const acceptIncomingCallRequest = () => {
  wss.sendPreOfferAnswer({
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_ACCEPTED,
  });

  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const rejectIncomingCallRequest = () => {
  wss.sendPreOfferAnswer({
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_REJECTED,
  });

  resetCallData();
};

export const handlePreOfferAnswer = (data: any) => {
  store.dispatch(setCallingDialogVisible(false));

  if (data.answer === preOfferAnswers.CALL_ACCEPTED) {
    sendOffer();
  } else {
    let rejectionReason;
    if (data.answer === preOfferAnswers.CALL_NOT_AVAILABLE) {
      rejectionReason = "Callee is not able to pick up the call right now";
    } else {
      rejectionReason = "Call rejected by the callee";
    }
    store.dispatch(
      setCallRejected({
        rejected: true,
        reason: rejectionReason,
      })
    );

    resetCallData();
  }
};

const sendOffer = async () => {
  const offer = await peerConnection?.createOffer();
  await peerConnection?.setLocalDescription(offer);
  wss.sendWebRTCOffer({
    calleeSocketId: connectedUserSocketId,
    offer: offer,
  });
};

export const handleOffer = async (data: any) => {
  await peerConnection?.setRemoteDescription(data.offer);
  const answer = await peerConnection?.createAnswer();
  await peerConnection?.setLocalDescription(answer);
  wss.sendWebRTCAnswer({
    callerSocketId: connectedUserSocketId,
    answer: answer,
  });
};

export const handleAnswer = async (data: any) => {
  await peerConnection?.setRemoteDescription(data.answer);
};

export const handleCandidate = async (data: any) => {
  try {
    await peerConnection?.addIceCandidate(data.candidate);
  } catch (e) {
    console.log("Error occured when trying to add received ice candidate");
    console.log(e);
  }
};

export const checkIfCallIsPossible = () => {
  if (
    store.getState().call.localStream === null ||
    store.getState().call.callState !== callStates.CALL_AVAILABLE
  ) {
    return false;
  } else {
    return true;
  }
};

let screenSharingStream: MediaStream | null = null;

export const switchForScreenSharingStream = async () => {
  if (!store.getState().call.screenSharingActive) {
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      store.dispatch(setScreenSharingActive(true));
      const senders = peerConnection?.getSenders();

      const sender = senders?.find((sender: any) => {
        if (!sender || !sender.track || !screenSharingStream) {
          return;
        }
        return sender.track.kind === screenSharingStream.getVideoTracks()[0].kind;
      });

      sender?.replaceTrack(screenSharingStream.getVideoTracks()[0]);
    } catch (e) {
      console.log("Error occured when trying to get screen sharing stream");
    }
  } else {
    const localStream = store.getState().call.localStream;
    const senders = peerConnection?.getSenders();

    const sender = senders?.find((sender) => {
      if (!sender || !sender.track || !screenSharingStream) {
        return;
      }
      return sender.track.kind === localStream.getVideoTracks()[0].kind;
    });

    sender?.replaceTrack(localStream.getVideoTracks()[0]);
    store.dispatch(setScreenSharingActive(false));

    if (screenSharingStream) {
      screenSharingStream.getTracks().forEach((track) => track.stop());
    }
  }
};

export const handleUserHangedUp = () => {
  resetCallDataAfterHangUp();
}

export const hangUp = () => {
  wss.sendUserHangedUp({
    connectedUserSocketId: connectedUserSocketId,
  });

  resetCallDataAfterHangUp();
}

const resetCallDataAfterHangUp = () => {
  if(store.getState().call.screenSharingActive) {
    screenSharingStream?.getTracks().forEach(track => track.stop())
  }

  store.dispatch(resetCallDataState())

  peerConnection?.close()
  peerConnection = null
  createPeerConnection();
  resetCallData();

  const localStream = store.getState().call.localStream
  localStream.getVideoTracks()[0].enabled = true
  localStream.getAudioTracks()[0].enabled = true
}

export const resetCallData = () => {
  connectedUserSocketId = null;
  console.log("here I am changin the call state");
  store.dispatch(setCallState(callStates.CALL_AVAILABLE));
};

export type Message = {
  received: boolean;
  content: string;
}

export const sendMessageUsingDataChannel = (message: string) => {
  if(dataChannel) {
    dataChannel.send(message)
  }
}
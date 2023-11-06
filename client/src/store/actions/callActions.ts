import { Message } from "../../utils/webRTC/webRTCHandler";

export const callStates = {
  CALL_UNAVAILABLE: "CALL_UNAVAILABLE",
  CALL_AVAILABLE: "CALL_AVAILABLE",
  CALL_REQUESTED: "CALL_REQUESTED",
  CALL_IN_PROGRESS: "CALL_IN_PROGRESS",
};

export const CALL_SET_LOCAL_STREAM = "CALL.SET_LOCAL_STREAM";
export const CALL_SET_CALL_STATE = "CALL.SET_CALL_STATE";
export const CALL_SET_CALLING_DIALOG_VISIBLE =
  "CALL.SET_CALLING_DIALOG_VISIBLE";
export const CALL_SET_CALLER_USERNAME = "CALL.SET_CALLER_USERNAME";
export const CALL_SET_CALL_REJECTED = "CALL.SET_CALL_REJECTED";
export const CALL_SET_REMOTE_STREAM = "CALL.SET_REMOTE_STREAM";
export const CALL_SET_LOCAL_MICROPHONE_ENABLED =
  "CALL.SET_LOCAL_MICROPHONE_ENABLED";
export const CALL_SET_LOCAL_CAMERA_ENABLED = "CALL.SET_LOCAL_CAMERA_ENABLED";
export const CALL_SET_SCREEN_SHARING_ACTIVE = "CALL.SET_SCREEN_SHARING_ACTIVE";
export const CALL_RESET_CALL_DATA = "CALL.RESET_CALL_DATA";
export const CALL_SET_GROUP_CALL_ACTIVE = "CALL.CALL_SET_GROUP_CALL_ACTIVE";
export const CALL_SET_GROUP_CALL_STREAMS = "CALL.SET_GROUP_CALL_STREAMS";
export const CALL_CLEAR_GROUP_CALL_DATA = "CALL.CLEAR_GROUP_CALL_DATA";
export const CALL_SET_CHAT_MESSAGE = "CALL.SET_CHAT_MESSAGE";

export const setLocalStream = (localStream: MediaStream | null) => {
  return {
    type: CALL_SET_LOCAL_STREAM,
    localStream,
  };
};

export const setCallState = (callState: string) => {
  return {
    type: CALL_SET_CALL_STATE,
    callState,
  };
};

export const setCallingDialogVisible = (visible: boolean) => {
  return {
    type: CALL_SET_CALLING_DIALOG_VISIBLE,
    callingDialogVisible: visible,
  };
};

export const setCallerUsername = (callerUsername: string) => {
  return {
    type: CALL_SET_CALLER_USERNAME,
    callerUsername,
  };
};

export const setCallRejected = (callRejectedDetails: {
  rejected: boolean;
  reason: string;
}) => {
  return {
    type: CALL_SET_CALL_REJECTED,
    callRejected: {
      rejected: callRejectedDetails.rejected,
      reason: callRejectedDetails.reason,
    },
  };
};

export const setRemoteStream = (remoteStream: MediaStream | null) => {
  return {
    type: CALL_SET_REMOTE_STREAM,
    remoteStream,
  };
};

export const setLocalMicrophoneEnabled = (enabled: boolean) => {
  return {
    type: CALL_SET_LOCAL_MICROPHONE_ENABLED,
    enabled,
  };
};

export const setLocalCameraEnabled = (enabled: boolean) => {
  return {
    type: CALL_SET_LOCAL_CAMERA_ENABLED,
    enabled,
  };
};

export const setScreenSharingActive = (active: boolean) => {
  return {
    type: CALL_SET_SCREEN_SHARING_ACTIVE,
    active,
  };
};

export const resetCallDataState = () => {
  return {
    type: CALL_RESET_CALL_DATA,
  };
};

export const setGroupCallActive = (active: boolean) => {
  console.log("setting group call Active");
  return {
    type: CALL_SET_GROUP_CALL_ACTIVE,
    active,
  };
};

export const setGroupCallIncomingStreams = (groupCallStreams: MediaStream[]) => {
  console.log('setting group call streams')
  return {
    type: CALL_SET_GROUP_CALL_STREAMS,
    groupCallStreams,
  };
};

export const clearGroupCallData = () => {
  return {
    type: CALL_CLEAR_GROUP_CALL_DATA,
  };
}

export const setMessage = (message: Message) => {
  return {
    type: CALL_SET_CHAT_MESSAGE,
    message: {
      received: message.received,
      content: message.content
    }
  };
}
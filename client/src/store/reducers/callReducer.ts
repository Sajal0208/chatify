import * as callActions from '../actions/callActions';

export interface ICallState {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    callState: string;
    callingDialogVisible: boolean;
    callerUsername: string;
    callRejected: {
        rejected: boolean;
        reason: string;
    };
    localCameraEnabled: boolean;
    localMicrophoneEnabled: boolean;
    screenSharingActive: boolean;
    groupCallActive: boolean;
    groupCallStreams: MediaStream[];
}

const initState = {
    localStream: null,
    remoteStream: null,
    callState: callActions.callStates.CALL_UNAVAILABLE,
    callingDialogVisible: false,
    callerUsername: '',
    callRejected: {
        rejected: false,
        reason: '',
    },
    localCameraEnabled: true,
    localMicrophoneEnabled: true,
    screenSharingActive: false,
    groupCallActive: false,
    groupCallStreams: [],
}

const reducer = (state: ICallState = initState, action: any) => {
    switch (action.type) {
        case callActions.CALL_SET_LOCAL_STREAM:
            return {
                ...state,
                localStream: action.localStream,
            }
        case callActions.CALL_SET_CALL_STATE:
            return {
                ...state,
                callState: action.callState,
            }
        case callActions.CALL_SET_CALLING_DIALOG_VISIBLE:
            return {
                ...state,
                callingDialogVisible: action.callingDialogVisible,
            }
        case callActions.CALL_SET_CALLER_USERNAME:
            return {
                ...state,
                callerUsername: action.callerUsername,
            }
        case callActions.CALL_SET_CALL_REJECTED:
            return {
                ...state,
                callRejected: action.callRejected
            }
        case callActions.CALL_SET_REMOTE_STREAM:
            return {
                ...state,
                remoteStream: action.remoteStream,
            }
        case callActions.CALL_SET_LOCAL_MICROPHONE_ENABLED:
            return {
                ...state,
                localMicrophoneEnabled: action.enabled,
            }
        case callActions.CALL_SET_LOCAL_CAMERA_ENABLED:
            return {
                ...state,
                localCameraEnabled: action.enabled,
            }
        case callActions.CALL_SET_SCREEN_SHARING_ACTIVE:
            return {
                ...state,
                screenSharingActive: action.active,
            }
        case callActions.CALL_RESET_CALL_DATA:
            return {
                ...state,
                remoteStream: null,
                screenSharingActive: false,
                callerUsername: '',
                localMicrophoneEnabled: true,
                localCameraEnabled: true,
                callingDialogVisible: false,
            }
        case callActions.CALL_SET_GROUP_CALL_ACTIVE:
            return {
                ...state,
                groupCallActive: action.active,
            }
        case callActions.CALL_SET_GROUP_CALL_STREAMS:
            return {
                ...state,
                groupCallStreams: action.groupCallStreams,
            }
        case callActions.CALL_CLEAR_GROUP_CALL_DATA:
            return {
                ...state,
                groupCallActive: false,
                groupCallStreams: [],
                callState: callActions.callStates.CALL_AVAILABLE,
                localMicrophoneEnabled: true,
                localCameraEnabled: true,
            }

        default:
            return state;
    }
}

export default reducer;
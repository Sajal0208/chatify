import React from 'react'
import { connect } from 'react-redux'
import Video from './Video'
import { Box } from '@chakra-ui/react'
import CallRejectedDialog from './Dialog/CallRejectedDialog'
import IncomingCallDialog from './Dialog/IncomingCallDialog'
import CallingDialog from './Dialog/CallingDialog'
import { callStates, setCallRejected, setLocalCameraEnabled, setLocalMicrophoneEnabled } from '../store/actions/callActions'
import ConversationButtons from './ConversationButtons/ConversationButtons'

type TDirectCallProps = {
    localStream: MediaStream | null
    remoteStream: MediaStream | null
    callState: string
    callerUsername: string
    callingDialogVisible: boolean
    callRejected: {
        rejected: boolean
        reason: string
    }
    localCameraEnabled: boolean
    localMicrophoneEnabled: boolean
    screenSharingActive: boolean
    // callWithVideo: boolean
    // setCallWithVideo: (callWithVideo: boolean) => void
    hideCallRejectedDialog: (callRejectedDetails: any) => void
    setCameraEnabled: (enabled: boolean) => void
    setMicrophoneEnabled: (enabled: boolean) => void
}

const DirectCall = (props: TDirectCallProps) => {
    const { localStream, callState, remoteStream, callerUsername, callingDialogVisible, callRejected, hideCallRejectedDialog } = props;
    console.log(callState)
    console.log(callingDialogVisible);

    return (
        <Box>
            {localStream && <Video videoStream={localStream} />}
            {remoteStream && callState === callStates.CALL_IN_PROGRESS && <Video videoStream={remoteStream} />}
            {callRejected.rejected && <CallRejectedDialog hideCallRejectedDialog={hideCallRejectedDialog} reason={callRejected.reason} />}
            {callState === callStates.CALL_REQUESTED && <IncomingCallDialog callerUsername={callerUsername} />}
            {callingDialogVisible && <CallingDialog />}
            {remoteStream && callState === callStates.CALL_IN_PROGRESS && <ConversationButtons {...props} />}
        </Box>
    )
}

function mapStateToProps({ call }: {
    call: {
        localStream: MediaStream | null
        callState: string
        callerUsername: string
        callingDialogVisible: boolean
        callRejected: {
            rejected: boolean
            reason: string
        }
        remoteStream: MediaStream | null
        localCameraEnabled: boolean
        localMicrophoneEnabled: boolean
        callWithVideo: boolean
        screenSharingActive: boolean
    }
}) {
    return {
        ...call
    }
}

function mapDispatchToProps(dispatch: any): {
    hideCallRejectedDialog: (callRejectedDetails: any) => void
    setCameraEnabled: (enabled: boolean) => void
    setMicrophoneEnabled: (enabled: boolean) => void
} {
    return {
        hideCallRejectedDialog: (callRejectedDetails: any) => dispatch(setCallRejected(callRejectedDetails)),
        setCameraEnabled: (enabled: boolean) => dispatch(setLocalCameraEnabled(enabled)),
        setMicrophoneEnabled: (enabled: boolean) => dispatch(setLocalMicrophoneEnabled(enabled))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectCall)
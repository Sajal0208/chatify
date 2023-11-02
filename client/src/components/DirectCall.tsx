import React from 'react'
import { connect } from 'react-redux'
import Video from './Video'
import { Box } from '@chakra-ui/react'
import CallRejectedDialog from './Dialog/CallRejectedDialog'
import IncomingCallDialog from './Dialog/IncomingCallDialog'
import CallingDialog from './Dialog/CallingDialog'
import { callStates, setCallRejected, setLocalCameraEnabled, setLocalMicrophoneEnabled } from '../store/actions/callActions'
import ConversationButtons from './ConversationButtons/ConversationButtons'
import { ICallState } from '../store/reducers/callReducer'
import { AppDispatch } from '../store/store'

interface IDirectCallProps extends ICallState {
    hideCallRejectedDialog: (callRejectedDetails: any) => void
    setCameraEnabled: (enabled: boolean) => void
    setMicrophoneEnabled: (enabled: boolean) => void
}

const DirectCall = (props: IDirectCallProps) => {
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
    call: ICallState
}) {
    return {
        ...call
    }
}

function mapDispatchToProps(dispatch: AppDispatch): {
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
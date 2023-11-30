import React from 'react'
import { connect } from 'react-redux'
import Video from './Video'
import { Box } from '@chakra-ui/react'
import CallRejectedDialog from './Dialog/CallRejectedDialog'
import IncomingCallDialog from './Dialog/IncomingCallDialog'
import CallingDialog from './Dialog/CallingDialog'
import { callStates, setCallRejected, setLocalCameraEnabled, setLocalMicrophoneEnabled, setMessage } from '../store/actions/callActions'
import ConversationButtons from './ConversationButtons/ConversationButtons'
import { ICallState } from '../store/reducers/callReducer'
import { AppDispatch } from '../store/store'
import Messanger from './Messanger'
import { Message } from '../utils/webRTC/webRTCHandler'

interface IDirectCallProps extends ICallState {
    hideCallRejectedDialog: (callRejectedDetails: any) => void
    setCameraEnabled: (enabled: boolean) => void
    setMicrophoneEnabled: (enabled: boolean) => void
    setDirectCallMessage: (message: Message) => void
}

const DirectCall = (props: IDirectCallProps) => {
    const { localStream, callState, message, remoteStream, callerUsername, setDirectCallMessage, callingDialogVisible, callRejected, hideCallRejectedDialog } = props;

    const handleToggle = (id: string) => {

    }

    return (
        <main className="grid items-center h-full w-full">
            <Box className="relative h-full w-full overflow-hidden">
                {localStream && <Video fixed={false} handleToggle={handleToggle} borderColor={"green"} id={"local-video"} videoHeight={48} videoWidth={48} videoStream={localStream} />}
                {remoteStream && callState === callStates.CALL_IN_PROGRESS && <Video fixed = {false} handleToggle={handleToggle} borderColor={"red"} id={"remote-video"}  videoHeight={48} videoWidth={48}  videoStream={remoteStream} />}
                {callRejected.rejected && <CallRejectedDialog hideCallRejectedDialog={hideCallRejectedDialog} reason={callRejected.reason} />}
                {callState === callStates.CALL_REQUESTED && <IncomingCallDialog callerUsername={callerUsername} />}
                {callingDialogVisible && <CallingDialog />}
                {remoteStream && callState === callStates.CALL_IN_PROGRESS && <ConversationButtons {...props} />}
                {remoteStream && callState === callStates.CALL_IN_PROGRESS && <Messanger setDirectCallMessage={setDirectCallMessage} message={message} />}
            </Box>
        </main>
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
    setDirectCallMessage: (message: Message) => void
} {
    return {
        hideCallRejectedDialog: (callRejectedDetails: any) => dispatch(setCallRejected(callRejectedDetails)),
        setCameraEnabled: (enabled: boolean) => dispatch(setLocalCameraEnabled(enabled)),
        setMicrophoneEnabled: (enabled: boolean) => dispatch(setLocalMicrophoneEnabled(enabled)),
        setDirectCallMessage: (message: Message) => dispatch(setMessage(message))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectCall)
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
    const [localVideo1CSS, setLocalVideo1CSS] = React.useState<string>("border-green-500 w-48 h-48")
    const [localVideo2CSS, setLocalVideo2CSS] = React.useState<string>("border-red-500 w-48 h-48")
    const [localVideo1FixedCSS, setLocalVideo1FixedCSS] = React.useState<string>("border-green-500 w-96 h-96")
    const [localVideo2FixedCSS, setLocalVideo2FixedCSS] = React.useState<string>("border-red-500 w-96 h-96")
    const [fixedToggle, setFixedToggle] = React.useState<boolean>(false)

    const handleToggle = (id: string) => {
        setFixedToggle(true);
        if(id === "local-video1") {
            setLocalVideo1FixedCSS("border-green-500 w-96 h-96")
            setLocalVideo2FixedCSS("border-red-500 w-48 h-48")
        } 
        
        if(id === "local-video2") {
            setLocalVideo2FixedCSS("border-red-500 w-96 h-96")
            setLocalVideo1FixedCSS("border-green-500 w-48 h-48")
        }
    }

    return (
        <main className = "grid items-center h-full w-full">
            <Box className="relative h-full w-full overflow-hidden">    
            {!fixedToggle ? (
                <React.Fragment>
                    {localStream && <Video fixed = {false} handleToggle={handleToggle} className = {localVideo1CSS} id = {"local-video1"} videoStream={localStream} />}
                    {localStream && <Video fixed = {false} handleToggle={handleToggle} className = {localVideo2CSS} id = {"local-video2"} videoStream={localStream} />}
                </React.Fragment>
            ): 
            (
                <React.Fragment>
                    {localStream && <Video fixed = {true} handleToggle={handleToggle} className = {localVideo1FixedCSS} id = {"local-video-fixed1"}  videoStream={localStream} />}
                    {localStream && <Video fixed = {true} handleToggle={handleToggle} className = {localVideo2FixedCSS} id = {"local-video-fixed2"}  videoStream={localStream} />}
                </React.Fragment>
            )
            }
                {/* {remoteStream && callState === callStates.CALL_IN_PROGRESS && <Video videoStream={remoteStream} />} */}
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
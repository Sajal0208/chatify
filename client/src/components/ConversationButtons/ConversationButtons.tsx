import React from 'react'
import { Box } from '@chakra-ui/react'
import { MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdVideoLabel, MdVideoCall, MdCamera } from 'react-icons/md'
import ConversationButton from './ConversationButton'
import { hangUp, switchForScreenSharingStream } from '../../utils/webRTC/webRTCHandler'

type TConversationButtonsProps = {
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
    screenSharingActive: boolean
    // callWithVideo: boolean
    hideCallRejectedDialog: (callRejectedDetails: any) => void;
    setCameraEnabled: (enabled: boolean) => void
    setMicrophoneEnabled: (enabled: boolean) => void
    // setCallWithVideo: (callWithVideo: boolean) => void
}

const ConversationButtons = (props: TConversationButtonsProps) => {
    const { localStream, localCameraEnabled, localMicrophoneEnabled, setCameraEnabled, setMicrophoneEnabled, screenSharingActive } = props;

    const onMicButtonClick = () => {
        if (!localStream) return;
        const micEnabled = localMicrophoneEnabled;
        localStream.getAudioTracks()[0].enabled = !micEnabled;
        setMicrophoneEnabled(!micEnabled);
    }

    const onCameraButtonClick = () => {
        if (!localStream) return;
        const cameraEnabled = localCameraEnabled;
        localStream.getVideoTracks()[0].enabled = !cameraEnabled;
        setCameraEnabled(!cameraEnabled)
    }

    const onScreenShareButtonClick = () => {
        switchForScreenSharingStream();
    }

    const onHangUpButtonClick = () => {
        hangUp();
    }

    return (
        <Box>
            <ConversationButton onClickHandler={onMicButtonClick}>
                {localMicrophoneEnabled ? <MdMic className='text-white w-6 h-6' /> : <MdMicOff className='text-white w-6 h-6' />}
            </ConversationButton>
            <ConversationButton onClickHandler={onHangUpButtonClick}>
                <MdCallEnd className='text-red-500 w-6 h-6' />
            </ConversationButton>
            <ConversationButton onClickHandler={onCameraButtonClick}>
                {localCameraEnabled ? <MdVideocam className='text-white w-6 h-6' /> : <MdVideocamOff className='text-white w-6 h-6' />}
            </ConversationButton>
            <ConversationButton onClickHandler={onScreenShareButtonClick} >
                {screenSharingActive ? <MdCamera className='text-white w-6 h-6' /> : <MdVideoLabel className='text-white w-6 h-6' />}
            </ConversationButton>
        </Box>
    )
}

export default ConversationButtons
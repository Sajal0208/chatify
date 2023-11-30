import React from 'react'
import { Box } from '@chakra-ui/react'
import { MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdVideoLabel, MdVideoCall, MdCamera } from 'react-icons/md'
import ConversationButton from './ConversationButton'
import { hangUp, switchForScreenSharingStream } from '../../utils/webRTC/webRTCHandler'
import { ICallState } from '../../store/reducers/callReducer'

interface IConversationButtonsProps extends ICallState {
    localStream: MediaStream | null
    localCameraEnabled: boolean
    localMicrophoneEnabled: boolean
    setCameraEnabled: (enabled: boolean) => void
    setMicrophoneEnabled: (enabled: boolean) => void
    screenSharingActive: boolean
    groupCall: boolean
}

const ConversationButtons = (props: any) => {
    const { localStream, localCameraEnabled, localMicrophoneEnabled, setCameraEnabled, setMicrophoneEnabled, screenSharingActive,
    groupCall } = props;

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
        <>
            <ConversationButton id = {'mic-off-button'} onClickHandler={onMicButtonClick}>
                {localMicrophoneEnabled ? <MdMic className='text-white w-6 h-6' /> : <MdMicOff className='text-white w-6 h-6' />}
            </ConversationButton>
            {!groupCall && <ConversationButton id = {'hang-up-button'} onClickHandler={onHangUpButtonClick}>
                <MdCallEnd className='text-red-500 w-6 h-6' />
            </ConversationButton>}
            <ConversationButton id = {'toggle-camera-button'} onClickHandler={onCameraButtonClick}>
                {localCameraEnabled ? <MdVideocam className='text-white w-6 h-6' /> : <MdVideocamOff className='text-white w-6 h-6' />}
            </ConversationButton>
            {!groupCall && <ConversationButton id = {'share-screen-button'} onClickHandler={onScreenShareButtonClick} >
                {screenSharingActive ? <MdCamera className='text-white w-6 h-6' /> : <MdVideoLabel className='text-white w-6 h-6' />}
            </ConversationButton>}
        </>
    )
}

export default ConversationButtons
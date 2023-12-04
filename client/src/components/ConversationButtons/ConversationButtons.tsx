import React from 'react'
import { Box } from '@chakra-ui/react'
import { MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdVideoLabel, MdVideoCall, MdCamera } from 'react-icons/md'
import ConversationButton from './ConversationButton'
import { hangUp, switchForScreenSharingStream } from '../../utils/webRTC/webRTCHandler'
import { ICallState } from '../../store/reducers/callReducer'
import useDragger from '../../hooks/useDragger'

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
    useDragger('btn', false);
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
        <Box id = {'btn'}className = {'cursor-pointer border-2 border-solid border-gray-400 rounded-lg h-14 absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-row justify-center gap-x-4'}>
            <ConversationButton  onClickHandler={onMicButtonClick}>
                {localMicrophoneEnabled ? <MdMic className='text-white w-6 h-6' /> : <MdMicOff className='text-white w-6 h-6' />}
            </ConversationButton>
            {!groupCall && <ConversationButton  onClickHandler={onHangUpButtonClick}>
                <MdCallEnd className='text-red-500 w-6 h-6' />
            </ConversationButton>}
            <ConversationButton  onClickHandler={onCameraButtonClick}>
                {localCameraEnabled ? <MdVideocam className='text-white w-6 h-6' /> : <MdVideocamOff className='text-white w-6 h-6' />}
            </ConversationButton>
            {!groupCall && <ConversationButton onClickHandler={onScreenShareButtonClick} >
                {screenSharingActive ? <MdCamera className='text-white w-6 h-6' /> : <MdVideoLabel className='text-white w-6 h-6' />}
            </ConversationButton>}
        </Box>
    )
}

export default ConversationButtons
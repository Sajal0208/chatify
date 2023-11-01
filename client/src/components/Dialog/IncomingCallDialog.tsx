import React, { useEffect } from 'react'
import './IncomingCallDialog.css'
import { Box, Button, Text } from '@chakra-ui/react'
import { acceptIncomingCallRequest, rejectIncomingCallRequest } from '../../utils/webRTC/webRTCHandler'

type TIncomingCallDialogProps = {
    callerUsername: string
}

const IncomingCallDialog = ({callerUsername}: TIncomingCallDialogProps) => {
    const handleAccept = () => {
        acceptIncomingCallRequest();
    }
    const handleReject = () => {
        rejectIncomingCallRequest();
    }
    useEffect(() => {

    }, [callerUsername])

    return (
        <Box className='direct_call_dialog'>
            <Text className='direct_call_dialog_caller_name'>
                {callerUsername}
            </Text>
            <Box className="direct_call_dialog_button_container">
                <Button onClick={handleAccept} className='direct_call_dialog_accept_button'>
                    Accept
                </Button>
                <Button onClick={handleReject} className='direct_call_dialog_reject_button'>
                    Reject
                </Button>
            </Box>
        </Box>
    )
}

export default IncomingCallDialog
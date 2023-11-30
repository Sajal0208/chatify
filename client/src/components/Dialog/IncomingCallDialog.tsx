import React, { useEffect } from 'react'
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
        <Box className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl  border-2 flex flex-col justify-center items-center border-white'>
            <Text className='text-3xl'>
                {callerUsername}
            </Text>
            <Box className="mt-4 w-full flex justify-evenly">
                <Button colorScheme='green' onClick={handleAccept} className='border-2 border-solid outline-none text-sm p-2 text-white bg-green-500 transition-all mr-2 '>
                    Accept
                </Button>
                <Button colorScheme='red' onClick={handleReject} className='border-2 border-solid outline-none text-sm p-2 text-white bg-green-500 transition-all'>
                    Reject
                </Button>
            </Box>
        </Box>
    )
}

export default IncomingCallDialog
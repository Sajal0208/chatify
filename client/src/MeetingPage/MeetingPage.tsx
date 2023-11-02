import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import ActiveUsersList from '../components/ActiveUsersList'
import * as webRTCHandler from '../utils/webRTC/webRTCHandler'
import DirectCall from '../components/DirectCall'

const MeetingPage = () => {

  useEffect(() => {
    webRTCHandler.getLocalStream()
  }, []);

  return (
    <Box className="bg-black text-white w-screen h-screen flex flex-row">
      <Box className="basis-3/4 flex flex-col w-full h-full">
        <Box className="border-2 basis-4/5">
          <DirectCall />
        </Box>
        <Box className='border-2  basis-1/5'>
          Rooms
        </Box>
      </Box>
      <Box className='basis-1/4 flex flex-col w-full h-full'>
        <Box className="border-2 basis-4/5">
          <ActiveUsersList />
        </Box>
        <Box className='border-2 basis-1/5'>
          logo
        </Box>
      </Box>
    </Box>
  )
}

export default MeetingPage
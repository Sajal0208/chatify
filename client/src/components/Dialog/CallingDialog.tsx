import { Box } from '@chakra-ui/react'
import React from 'react'
import './CallingDialog.css'
import { hangUp } from '../../utils/webRTC/webRTCHandler'
import { MdCallEnd } from 'react-icons/md'

const CallingDialog = () => {
  const onHangUpButtonClick = () => {
    hangUp()
  }

  return (
    <Box className="bg-white text-black">
      Calling...
      <button onClick={onHangUpButtonClick}>
        <MdCallEnd className='text-white w-6 h-6' />
      </button>
    </Box>
  )
}

export default CallingDialog
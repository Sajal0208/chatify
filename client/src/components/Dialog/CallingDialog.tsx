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
    <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 items-center rounded-xl justify-center border-2 border-green-500">
      <button className = {"flex flex-row"} onClick={onHangUpButtonClick}>
        End
        <MdCallEnd className='text-red-500 w-6 h-6 ml-2' />
      </button>
    </Box>
  )
}

export default CallingDialog
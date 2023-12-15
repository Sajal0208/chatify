import { Box } from '@chakra-ui/react'
import React from 'react'
import useDragger from '../hooks/useDragger'

const MessageDisplayer = (props: any) => {
  return (
    <Box className = "absolute bottom-10 left-10 cursor-pointer border rounded-xl border-solid border-white w-min p-2">
        {props.message}
    </Box>
  )
}

export default MessageDisplayer 
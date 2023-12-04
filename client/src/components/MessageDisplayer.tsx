import { Box } from '@chakra-ui/react'
import React from 'react'
import useDragger from '../hooks/useDragger'

const MessageDisplayer = (props: any) => {
  return (
    <Box>
        {props.message}
    </Box>
  )
}

export default MessageDisplayer 
import { Box } from '@chakra-ui/react'
import React from 'react'

const MessageDisplayer = (props: any) => {
  return (
    <Box>
        {props.message}
    </Box>
  )
}

export default MessageDisplayer 
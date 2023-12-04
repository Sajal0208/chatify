import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'

const CallRejectedDialog = ({reason, hideCallRejectedDialog}: {
  reason: string
  hideCallRejectedDialog: any
}) => {
  console.log('reason', reason);
  console.log('hideCallRejectedDialog', hideCallRejectedDialog);
  useEffect(() => {
    setTimeout(() => {
      hideCallRejectedDialog({
        rejected: false,
        reason: ''
      });
    }, 4000)  
  }, [hideCallRejectedDialog]);
  return (
    <Box className = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl  border-2 flex flex-col justify-center items-center">
        {reason}
    </Box>
  )
}

export default CallRejectedDialog
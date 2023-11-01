import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import './CallRejectedDialog.css'

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
    <Box className = "call_rejected_dialog ">
        {reason}
    </Box>
  )
}

export default CallRejectedDialog
import { Box } from '@chakra-ui/react'
import ConversationButtons from './ConversationButtons/ConversationButtons'
import Video from './Video'

const GroupCallRoom = (props: any) => {
  const {groupCallStreams, } = props;
  return (
    <Box className='text-white'>
      <span>
        Group Call
      </span>
      <div className='flex flex-row gap-x-4'>
        {
          groupCallStreams && groupCallStreams.map((stream: MediaStream, index: number) => {
            console.log("stream -------------------" + stream)
            // return <Video id = {'group-call'} key={index} videoStream={stream} />
            return null
          })
        }
      </div>
      <ConversationButtons {...props} groupCall = {true} />
    </Box>
  )
}



export default GroupCallRoom
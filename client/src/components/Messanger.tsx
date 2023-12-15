import { useState, useEffect } from "react"
import { Message, sendMessageUsingDataChannel } from "../utils/webRTC/webRTCHandler"
import MessageDisplayer from "./MessageDisplayer"
import useDragger from "../hooks/useDragger"
import { Box, Input } from "@chakra-ui/react"

type MessangerProps = {
    message: Message
    setDirectCallMessage: (message: Message) => void
}

const Messanger = ({ message, setDirectCallMessage }: MessangerProps) => {
    const [input, setInput] = useState('')
    const handleOnKeyDownEvent = (e: any) => {
        if (e.keyCode === 13) {
            sendMessageUsingDataChannel(input)
            setInput('')
        }
    }

    useEffect(() => {
        if(message.received) {
            setTimeout(() => {
                setDirectCallMessage({ received: false, content: '' })
            }, 3000)
        }
    }, [message.received])

    return (
        <>
            <Box className = {'absolute bottom-12 h-12 left-1/2 -translate-x-1/2'}>
                <Input
                    type='text'
                    value={input}
                    className="text-white cursor-pointer h-12"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleOnKeyDownEvent}
                    placeholder="Type your message"
                />
            </Box>
            <Box>
                {message.received && <MessageDisplayer message={message.content} />}
            </Box>
        </>
    )
}

export default Messanger


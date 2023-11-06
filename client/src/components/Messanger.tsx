import { useState, useEffect } from "react"
import { Message, sendMessageUsingDataChannel } from "../utils/webRTC/webRTCHandler"
import MessageDisplayer from "./MessageDisplayer"

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
            <input
                type='text'
                value={input}
                className="text-black"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleOnKeyDownEvent}
                placeholder="Type your message"
            />
            {message.received && <MessageDisplayer message={message.content} />}
        </>
    )
}

export default Messanger


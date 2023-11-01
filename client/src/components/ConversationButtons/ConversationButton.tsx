import { Button } from '@chakra-ui/react'
import React from 'react'

type TConversationButtonProps = {
    children: React.ReactNode
    onClickHandler: () => void 
}
const ConversationButton = (props: TConversationButtonProps) => {
    const { onClickHandler } = props;
    return (
        <button className='w-12 h-12 rounded-full ml-4 flex items-center justify-center' onClick={onClickHandler}>
            {props.children}
        </button>
    )
}

export default ConversationButton
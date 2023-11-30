import { Button } from '@chakra-ui/react'
import React from 'react'
import useDragger from '../../hooks/useDragger'


type TConversationButtonProps = {
    children: React.ReactNode
    onClickHandler: () => void 
    id: string
}
const ConversationButton = (props: TConversationButtonProps) => {
    const { id, onClickHandler } = props;
    useDragger(id, false)
    return (
        <button id = {id} className=' absolute w-12 h-12 rounded-full ml-4 flex items-center justify-center' onClick={(e: any) => {
            if(e.detail === 2) {
                onClickHandler();
            }
        }}>
            {props.children}
        </button>
    )
}

export default ConversationButton 
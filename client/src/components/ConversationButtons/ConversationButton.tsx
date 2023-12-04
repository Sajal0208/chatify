import { Button } from '@chakra-ui/react'
import React from 'react'
import useDragger from '../../hooks/useDragger'


type TConversationButtonProps = {
    children: React.ReactNode
    onClickHandler: () => void 
}
const ConversationButton = (props: TConversationButtonProps) => {
    const {  onClickHandler } = props;
    return (
        <button className='w-12 h-12 rounded-full flex items-center justify-center' onClick={(e: any) => {
            if(e.detail === 2) {
                onClickHandler();
            }
        }}>
            {props.children}
        </button>
    )
}

export default ConversationButton 
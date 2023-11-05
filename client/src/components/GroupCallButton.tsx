import React from 'react'

type TGroupCall = {
    onClickHandler: () => void;
    label: string;
}

const GroupCallButton = ({ onClickHandler, label }: TGroupCall) => {
    return (
        <button onClick = {onClickHandler}>
            {label}
        </button>
    )
}

export default GroupCallButton
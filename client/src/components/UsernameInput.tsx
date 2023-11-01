import React from 'react'
import { Input } from '@chakra-ui/react'


interface IUsernameProps {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
}
const UsernameInput = (props: IUsernameProps) => {
    const { username, setUsername } = props;

    return (
        <Input value={username} onChange={(e) => {
            setUsername(e.target.value)
        }} placeholder="Enter Username" />
    )
}

export default UsernameInput
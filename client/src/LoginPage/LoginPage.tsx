import React, { Dispatch, useEffect } from 'react'
import { Box, Button, Input, Text } from "@chakra-ui/react";
import UsernameInput from '../components/UsernameInput';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUsername } from '../store/actions/meetingActions';
import { registerNewUser } from '../utils/wssConnection';

const LoginPage = ({ saveUsername }:
  { saveUsername: (username: string) => void }
) => {
  const [username, setUsername] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    if(username.length < 3 || username.length === 0) {
      setError("Username must be at least 3 characters long");
      return;
    }
    registerNewUser(username)
    saveUsername(username)
    navigate(`/meeting`);
  }

  useEffect(() => {
    setError("");
    if(username.length === 0) {
      return;
    }
    if(username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }
  }, [username])

  return (
    <Box className="bg-black text-white min-h-screen min-w-screen relative">
      <Box className="w-52 flex flex-col gap-y-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <UsernameInput username={username} setUsername={setUsername} />
        <Text className="text-red-500" fontSize="md">
          {error && error}
        </Text>
        <Button onClick={handleCreate} >Join Room</Button>
      </Box>
    </Box>
  )
}

const mapActionsToProps = (dispatch: any) => {
  return {
    saveUsername: (username: string) => dispatch(setUsername(username))
  }
}

export default connect(null, mapActionsToProps)(LoginPage);
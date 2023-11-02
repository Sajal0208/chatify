import React from 'react'
import { Box, Button } from '@chakra-ui/react'
import AnimatedText from '../components/AnimatedText'
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box className="bg-black text-white min-h-screen min-w-screen relative">
    <Box className="flex flex-col gap-y-8 absolute items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <AnimatedText className="font-bold text-9xl" text="ChatiFy" />
      <Box className="flex flex-row gap-x-4">
        <Button onClick = {() => {
          navigate(`/login`);
        }}>Join Room</Button>
      </Box>
    </Box>
  </Box>
  )
}

export default LandingPage
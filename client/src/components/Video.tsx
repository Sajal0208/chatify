import React, { useState, useEffect, useRef } from "react";
import useDragger from "../hooks/useDragger";
import { Box } from "@chakra-ui/react";

interface VideoProps {
  videoStream: MediaStream;
  borderColor: string;
  id: string;
  handleToggle: (id: string) => void;
  fixed: boolean;
  videoHeight?: number;
  videoWidth?: number;
  defaultPosition: { top?: number; left?: number; bottom?: number; right?: number };
}
const Video = ({ videoStream, videoHeight, videoWidth, borderColor, id, handleToggle, fixed, defaultPosition }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useDragger(id, fixed);
  const [positionClassname, setPositionClassname] = useState<string>(() => {
    let classname = ''
    if(defaultPosition.hasOwnProperty('top')) {
      classname = classname + ' top-' + defaultPosition.top
    }
    if(defaultPosition.hasOwnProperty('left')) {
      classname = classname + ' left-' + defaultPosition.left
    }
    if(defaultPosition.hasOwnProperty('bottom')) {
      classname = classname + ' bottom-' + defaultPosition.bottom
    }
    if(defaultPosition.hasOwnProperty('right')) {
      classname = classname + ' right-' + defaultPosition.right
    }
    console.log(classname)
    return classname
  })

  const getPositionClassname = () => {
    let classname = ''
    if(defaultPosition.hasOwnProperty('top')) {
      classname = classname + ' top-' + defaultPosition.top
    }
    if(defaultPosition.hasOwnProperty('left')) {
      classname = classname + ' left-' + defaultPosition.left
    }
    if(defaultPosition.hasOwnProperty('bottom')) {
      classname = classname + ' bottom-' + defaultPosition.bottom
    }
    if(defaultPosition.hasOwnProperty('right')) {
      classname = classname + ' right-' + defaultPosition.right
    }
    return classname
  }

  useEffect(() => {
    try {
      if (videoStream && videoRef.current) {
        const video = videoRef.current;
        video!.srcObject = videoStream;

        video.onloadedmetadata = () => {
          video.play();
        }
      }
    } catch (error) {
      console.log(error)
    }
  }, [videoStream])


  if (!videoStream) {
    return null;
  }

  const handleClick = (e: any) => {
    if (e.detail === 2) {
      console.log("double click")
      if (!id) return;
      handleToggle(id);
    }
  }

  return (
    <video onClick={handleClick} id={id} className={`border-2 object-cover cursor-pointer transition rounded-full border-solid absolute border-${borderColor}-500 ${positionClassname}`} ref={videoRef}  muted autoPlay={true} playsInline={true} />
  )
}

export default Video;
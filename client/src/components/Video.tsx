import React, { useState, useEffect, useRef } from "react";
import useDragger from "../hooks/useDragger";

interface VideoProps {
  videoStream: MediaStream;
  className?: string;
  id: string;
}
const Video = ({ videoStream, className, id }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useDragger(id);
  
  useEffect(() => {
    try {
      if(videoStream && videoRef.current) {
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

  if(!videoStream) {
    return null;
  }

  return (
      <video id = {id} className={className ? className : "rounded-full w-48 h-48 absolute"} ref={videoRef} muted width="100%" autoPlay={true} playsInline={true} />
  )
}

export default Video;
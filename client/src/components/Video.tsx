import React, { useState, useEffect, useRef } from "react";

interface VideoProps {
  videoStream: MediaStream;
  className?: string;
}
const Video = ({ videoStream, className }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
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
    <video className={className ? className : "rounded-full w-48 h-48"} ref={videoRef} muted width="100%" autoPlay={true} playsInline={true} />
  )
}

export default Video;
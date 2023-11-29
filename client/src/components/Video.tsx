import React, { useState, useEffect, useRef } from "react";
import useDragger from "../hooks/useDragger";

interface VideoProps {
  videoStream: MediaStream;
  className?: string;
  id: string;
  handleToggle: (id: string) => void;
  fixed: boolean;
}
const Video = ({ videoStream, className = "", id, handleToggle, fixed }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useDragger(id, fixed);

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

  const existingClassName = "border-2 object-cover cursor-pointer transition rounded-full border-solid absolute"

  const handleClick = (e: any) => {
    if (e.detail === 2) {
      console.log("double click")
      if(!id) return;
      handleToggle(id);
    }
  }

  return (
    <video onClick={handleClick} id={id} className={existingClassName + " " + className} ref={videoRef} muted width="100%" autoPlay={true} playsInline={true} />
  )
}

export default Video;
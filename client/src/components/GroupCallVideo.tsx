import React, { useState, useRef, useEffect } from 'react'

type TGroupCallVideoProps = {
    videoStream: MediaStream
}

const GroupCallVideo = ({videoStream} : TGroupCallVideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(() => {
        if(videoStream && videoRef.current) {
            const video = videoRef.current;
            video!.srcObject = videoStream;
      
            video.onloadedmetadata = () => {
              video.play();
            }
          }
    }, [videoStream])
    
    return (
        <div className='w-96 h-96'>
            <video className = {"w-80 h-80"} ref={videoRef} autoPlay  />
        </div>
    )
}

export default GroupCallVideo
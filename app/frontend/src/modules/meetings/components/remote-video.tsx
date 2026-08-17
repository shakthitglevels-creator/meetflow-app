"use client";

import {
  useEffect,
  useRef,
} from "react";

type Props = {
  stream: MediaStream;
};

export const RemoteVideo = ({
  stream,
}: Props) => {
  const videoRef =
    useRef<HTMLVideoElement>(
      null,
    );

  useEffect(() => {
    if (
      videoRef.current
    ) {
      videoRef.current.srcObject =
        stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="h-full w-full rounded-lg object-cover"
    />
  );
};
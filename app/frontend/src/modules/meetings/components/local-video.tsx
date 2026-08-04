"use client";

import { useEffect, useRef } from "react";

type Props = {
  stream: MediaStream;
};

export const LocalVideo = ({
  stream,
}: Props) => {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="h-full w-full rounded-lg object-cover"
    />
  );
};
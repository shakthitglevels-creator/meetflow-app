


"use client";

import { useEffect, useState } from "react";

export const useLocalMedia = () => {
  const [stream, setStream] =
    useState<MediaStream | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    console.log("Hook mounted");

    const startMedia = async () => {
      console.log("Requesting media");

      try {
        const mediaStream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        console.log("Media success");

        setStream(mediaStream);
      } catch (error) {
        console.error(
          "Media failed",
          error,
        );

        setError(
          "No camera or microphone device found."
        );
      } finally {
        console.log(
          "Loading set to false",
        );

        setLoading(false);
      }
    };

    startMedia();
  }, []);

  return {
    stream,
    loading,
    error,
  };
};
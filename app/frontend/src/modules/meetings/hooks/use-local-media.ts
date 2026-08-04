// "use client";

// import { useEffect, useState } from "react";

// export const useLocalMedia = () => {
//   const [stream, setStream] = useState<MediaStream | null>(null);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState<string | null>(null);
// console.log("Hook mounted");
//   useEffect(() => {
//     console.log("Requesting media");
//     let mediaStream: MediaStream | null = null;

//     const startMedia = async () => {
//       try {
//         const localStream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });

//         mediaStream = localStream;
//         setStream(localStream);
//       } catch (error) {
//         console.error("getUserMedia error:", error);

//         if (error instanceof DOMException && error.name === "NotFoundError") {
//           setError("No camera or microphone device found.");
//         } else if (
//           error instanceof DOMException &&
//           error.name === "NotAllowedError"
//         ) {
//           setError("Camera or microphone permission denied.");
//         } else {
//           setError("Failed to access media devices.");
//         }
//       }
//     };

//     startMedia();

//     return () => {
//       mediaStream?.getTracks().forEach((track) => track.stop());
//     };
//   }, []);

//   return {
//     stream,
//     loading,
//     error,
//   };
// };



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
"use client";

import { useEffect } from "react";

import { socket } from "@/lib/socket";

export const useSocketConnection = () => {
  useEffect(() => {
 const token =
  localStorage.getItem(
    "meetflow_access_token",
  );

  console.log(
  "Socket token:",
  token
);

    if (!token) {
      return;
    }

    socket.auth = {
      token,
    };

    console.log(
  "Connecting socket..."
);

    socket.connect();

    (window as any).socket = socket;

socket.on(
  "connect",
  () => {
    console.log(
      "Socket Connected:",
      socket.id,
    );
  },
);

socket.on(
  "connect_error",
  (error) => {
    console.error(
      "Socket Error:",
      error.message,
    );
  },
);

    return () => {
      socket.disconnect();
    };
  }, []);
};
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
      token,
    );

    if (!token) {
      return;
    }

    socket.auth = {
      token,
    };

    console.log(
      "Before connect:",
      socket.connected,
      socket.id,
    );

    if (!socket.connected) {
      console.log(
        "Connecting socket...",
      );

      socket.connect();
    }

    (window as any).socket =
      socket;

    const handleConnect = () => {
      console.log(
        "Socket Connected:",
        socket.id,
      );
    };

    const handleConnectError = (
      error: Error,
    ) => {
      console.error(
        "Socket Error:",
        error.message,
      );
    };

    socket.on(
      "connect",
      handleConnect,
    );

    socket.on(
      "connect_error",
      handleConnectError,
    );

    return () => {
      console.log(
        "Cleaning socket listeners:",
        socket.id,
      );

      socket.off(
        "connect",
        handleConnect,
      );

      socket.off(
        "connect_error",
        handleConnectError,
      );

      /*
       * DO NOT disconnect here.
       *
       * React Strict Mode + Fast Refresh
       * causes mount/unmount cycles in development.
       *
       * Disconnecting here creates
       * brand new socket connections repeatedly.
       */
    };
  }, []);
};
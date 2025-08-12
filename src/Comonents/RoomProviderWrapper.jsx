import React from "react";
import { RoomProvider } from "@liveblocks/react";

export default function RoomProviderWrapper({ roomId, children }) {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null, // For tracking mouse positions
        color: "#ff0000", // Default user color
      }}
      initialStorage={{
        shapes: [], // Shared shapes
      }}
    >
      {children}
    </RoomProvider>
  );
}

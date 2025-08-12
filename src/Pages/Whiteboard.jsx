import React from "react";
import { RoomProvider } from "@liveblocks/react";
import WhiteboardCanvas from "../Comonents/WhiteboardCanvas";
import Cursors from "../Comonents/Cursors";

export default function Whiteboard() {
  return (
    <RoomProvider id="my-room" initialStorage={{ shapes: [] }}>
      <div style={{ position: "relative" }}>
        <WhiteboardCanvas />
        <Cursors /> {/* Cursors layer over the canvas */}
      </div>
    </RoomProvider>
  );
}

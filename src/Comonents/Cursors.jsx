import React from "react";
import { useOthers, useUpdateMyPresence } from "@liveblocks/react";

export default function Cursors() {
  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();

  const handleMouseMove = (e) => {
    updateMyPresence({
      cursor: { x: e.clientX, y: e.clientY }
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ width: "100%", height: "100%" }}
    >
      {others.map(({ connectionId, presence }) =>
        presence?.cursor ? (
          <div
            key={connectionId}
            style={{
              position: "absolute",
              left: presence.cursor.x,
              top: presence.cursor.y,
              width: 10,
              height: 10,
              background: "red",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ) : null
      )}
    </div>
  );
}

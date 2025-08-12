import React from "react";
import { useOthers } from "@liveblocks/react";

export default function PresenceAvatars() {
  const others = useOthers();
  return (
    <div style={{ display: "flex", gap: "5px" }}>
      {others.map((user, i) => (
        <div
          key={i}
          style={{
            backgroundColor: user.presence?.color || "#ccc",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
          }}
        ></div>
      ))}
    </div>
  );
}

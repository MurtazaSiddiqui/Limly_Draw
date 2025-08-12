import React, { useState } from "react";
import { useBroadcastEvent, useEventListener } from "@liveblocks/react";

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const broadcast = useBroadcastEvent();

  useEventListener((event) => {
    if (event.type === "chat") {
      setMessages((prev) => [...prev, event.message]);
    }
  });

  const sendMessage = (msg) => {
    broadcast({ type: "chat", message: msg });
  };

  return (
    <div>
      <div style={{ maxHeight: 200, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
      <input
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage(e.target.value);
            e.target.value = "";
          }
        }}
        placeholder="Type message..."
      />
    </div>
  );
}

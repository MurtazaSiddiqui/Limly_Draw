import React, { useRef, useEffect } from "react";
import { useStorage } from "@liveblocks/react";

export default function Canvas() {
  const canvasRef = useRef(null);
  const shapes = useStorage((root) => root.shapes);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    shapes?.forEach((s) => {
      if (s.type === "rect") {
        ctx.fillStyle = s.color;
        ctx.fillRect(s.x, s.y, s.width, s.height);
      }
    });
  }, [shapes]);

  return <canvas ref={canvasRef} width={800} height={600} style={{ border: "1px solid #ccc" }} />;
}

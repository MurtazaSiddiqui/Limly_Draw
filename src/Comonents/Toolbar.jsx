import React from "react";
import { useMutation } from "@liveblocks/react";

export default function Toolbar() {
  const addShape = useMutation(({ storage }) => {
    const shapes = storage.get("shapes");
    shapes.push({
      type: "rect",
      x: Math.random() * 400,
      y: Math.random() * 300,
      width: 80,
      height: 80,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });
  }, []);

  return <button onClick={addShape}>Add Rectangle</button>;
}

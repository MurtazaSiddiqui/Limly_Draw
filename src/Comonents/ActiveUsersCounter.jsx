import React from "react";
import { useOthers } from "@liveblocks/react";

export default function ActiveUsersCounter() {
  const others = useOthers();
  return <div>{others.length + 1} active users</div>;
}

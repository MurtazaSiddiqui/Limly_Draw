import { useMyPresence, useOthers } from '../lib/liveblocks';
import { useCallback, useEffect } from 'react';

export default function CollaborativeCursor({ canvasRef }) {
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  const handlePointerMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    updateMyPresence({
      cursor: { x, y }
    });
  }, [updateMyPresence]);

  const handlePointerLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [handlePointerMove, handlePointerLeave]);

  return (
    <>
      {others.map(({ connectionId, presence, info }) => {
        if (!presence.cursor) return null;

        return (
          <div
            key={connectionId}
            className="absolute pointer-events-none z-50"
            style={{
              left: presence.cursor.x,
              top: presence.cursor.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Cursor */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-md"
            >
              <path
                d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                fill={info?.color || '#3b82f6'}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>

            {/* User name */}
            {info?.name && (
              <div
                className="absolute top-5 left-2 px-2 py-1 bg-black text-white text-xs rounded-md whitespace-nowrap"
                style={{ backgroundColor: info?.color || '#3b82f6' }}
              >
                {info.name}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

// Selection cursors for when users select elements
export function SelectionCursor({ selection, connectionId, info }) {
  if (!selection || selection.length === 0) return null;

  return (
    <div className="absolute pointer-events-none z-40">
      {selection.map((elementId) => (
        <div
          key={`${connectionId}-${elementId}`}
          className="absolute border-2 border-dashed animate-pulse"
          style={{
            borderColor: info?.color || '#3b82f6',
            // Position based on element bounds - you'll need to calculate this
            // based on your element storage structure
          }}
        />
      ))}
    </div>
  );
}
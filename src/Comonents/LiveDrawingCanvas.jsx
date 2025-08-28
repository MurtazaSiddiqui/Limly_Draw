import { useRef, useEffect, useCallback, useState } from 'react';
import { useStorage, useMutation, useMyPresence, useBroadcastEvent } from '../lib/liveblocks';
import CollaborativeCursor from './CollaborativeCursor';
// import { v4 as uuidv4 } from 'uuid';

export default function LiveDrawingCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [myPresence, updateMyPresence] = useMyPresence();

  // Get elements from Liveblocks storage
  const elements = useStorage((root) => root.elements);
  const appState = useStorage((root) => root.appState);

  // Broadcast drawing events
  const broadcast = useBroadcastEvent();

  // Mutations for updating storage
  const addElement = useMutation(({ storage }, element) => {
    const elements = storage.get('elements');
    elements.push(element);
  }, []);

  const updateElement = useMutation(({ storage }, elementId, updates) => {
    const elements = storage.get('elements');
    const index = elements.findIndex(el => el.id === elementId);
    if (index !== -1) {
      const element = elements.get(index);
      Object.entries(updates).forEach(([key, value]) => {
        element.set(key, value);
      });
    }
  }, []);

  const deleteElements = useMutation(({ storage }, elementIds) => {
    const elements = storage.get('elements');
    const newElements = elements.filter(el => !elementIds.includes(el.id));
    storage.set('elements', newElements);
  }, []);

  // Drawing functions
  const startDrawing = useCallback((e) => {
    if (!canvasRef.current || myPresence.selectedTool === 'select') return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentPath([{ x, y }]);

    // Update presence to show drawing state
    updateMyPresence({ isDrawing: true });

    // Broadcast drawing start
    broadcast({
      type: 'drawing-start',
      point: { x, y },
      tool: myPresence.selectedTool,
      color: myPresence.selectedColor,
      strokeWidth: myPresence.strokeWidth,
    });
  }, [myPresence, updateMyPresence, broadcast]);

  const draw = useCallback((e) => {
    if (!isDrawing || !canvasRef.current || myPresence.selectedTool === 'select') return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPath = [...currentPath, { x, y }];
    setCurrentPath(newPath);

    // Broadcast drawing update
    broadcast({
      type: 'drawing-update',
      point: { x, y },
    });
  }, [isDrawing, currentPath, myPresence.selectedTool, broadcast]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;

    // Create element from current path
    if (currentPath.length > 1) {
      const element = {
        id: uuidv4(),
        type: 'freedraw',
        points: currentPath,
        strokeColor: myPresence.selectedColor,
        strokeWidth: myPresence.strokeWidth,
        roughness: 1,
        opacity: 100,
        timestamp: Date.now(),
      };

      addElement(element);
    }

    setIsDrawing(false);
    setCurrentPath([]);
    updateMyPresence({ isDrawing: false });

    // Broadcast drawing end
    broadcast({
      type: 'drawing-end',
    });
  }, [isDrawing, currentPath, myPresence, addElement, updateMyPresence, broadcast]);

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !elements) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (appState?.gridMode) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw all elements
    elements.forEach((element) => {
      drawElement(ctx, element);
    });

    // Draw current path being drawn
    if (isDrawing && currentPath.length > 1) {
      ctx.strokeStyle = myPresence.selectedColor;
      ctx.lineWidth = myPresence.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      
      ctx.stroke();
    }
  }, [elements, appState, isDrawing, currentPath, myPresence]);

  // Helper functions
  const drawGrid = (ctx, width, height) => {
    const gridSize = 20;
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawElement = (ctx, element) => {
    if (!element || !element.points) return;

    ctx.strokeStyle = element.strokeColor || '#000000';
    ctx.lineWidth = element.strokeWidth || 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = (element.opacity || 100) / 100;

    switch (element.type) {
      case 'freedraw':
        if (element.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          
          for (let i = 1; i < element.points.length; i++) {
            ctx.lineTo(element.points[i].x, element.points[i].y);
          }
          
          ctx.stroke();
        }
        break;
      
      case 'rectangle':
        ctx.strokeRect(
          element.x,
          element.y,
          element.width,
          element.height
        );
        break;

      case 'circle':
        ctx.beginPath();
        ctx.arc(
          element.x + element.width / 2,
          element.y + element.height / 2,
          Math.min(element.width, element.height) / 2,
          0,
          2 * Math.PI
        );
        ctx.stroke();
        break;

      default:
        break;
    }

    ctx.globalAlpha = 1;
  };

  // Event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, [startDrawing, draw, stopDrawing]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        className="absolute top-0 left-0 cursor-crosshair border border-gray-300"
        style={{
          cursor: myPresence.selectedTool === 'select' ? 'default' : 'crosshair'
        }}
      />
      <CollaborativeCursor canvasRef={canvasRef} />
    </div>
  );
}
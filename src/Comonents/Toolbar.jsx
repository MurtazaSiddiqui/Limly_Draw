import { useMyPresence, useMutation } from '../lib/liveblocks';
import { useState } from 'react';

export default function Toolbar() {
  const [myPresence, updateMyPresence] = useMyPresence();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokeWidthPicker, setShowStrokeWidthPicker] = useState(false);

  const colors = [
    '#000000', '#e60049', '#0bb4ff', '#50e991', '#e6d800', 
    '#9b19f5', '#ffa300', '#dc0ab4', '#b3d4ff', '#00bfa0'
  ];

  const strokeWidths = [1, 2, 4, 6, 8, 10];

  const tools = [
    { id: 'select', icon: '↖️', name: 'Select' },
    { id: 'pen', icon: '✏️', name: 'Pen' },
    { id: 'rectangle', icon: '⬜', name: 'Rectangle' },
    { id: 'circle', icon: '⭕', name: 'Circle' },
    { id: 'arrow', icon: '➡️', name: 'Arrow' },
    { id: 'text', icon: '📝', name: 'Text' },
    { id: 'eraser', icon: '🗑️', name: 'Eraser' },
  ];

  const updateAppState = useMutation(({ storage }, updates) => {
    const appState = storage.get('appState');
    Object.entries(updates).forEach(([key, value]) => {
      appState.set(key, value);
    });
  }, []);

  const handleToolChange = (toolId) => {
    updateMyPresence({ selectedTool: toolId });
  };

  const handleColorChange = (color) => {
    updateMyPresence({ selectedColor: color });
    setShowColorPicker(false);
  };

  const handleStrokeWidthChange = (width) => {
    updateMyPresence({ strokeWidth: width });
    setShowStrokeWidthPicker(false);
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="flex items-center gap-2">
          {/* Tools */}
          <div className="flex items-center gap-1">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolChange(tool.id)}
                className={`p-2 rounded-md transition-colors ${
                  myPresence.selectedTool === tool.id
                    ? 'bg-blue-100 text-blue-600 border-blue-300'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                } border`}
                title={tool.name}
              >
                <span className="text-lg">{tool.icon}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-300 mx-2"></div>

          {/* Color Picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-8 h-8 rounded border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: myPresence.selectedColor }}
              title="Color"
            />
            
            {showColorPicker && (
              <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 grid grid-cols-5 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Stroke Width */}
          <div className="relative">
            <button
              onClick={() => setShowStrokeWidthPicker(!showStrokeWidthPicker)}
              className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md"
              title="Stroke Width"
            >
              <div 
                className="w-6 h-1 bg-current rounded"
                style={{ 
                  height: `${Math.max(2, Math.min(6, myPresence.strokeWidth))}px`,
                  backgroundColor: myPresence.selectedColor 
                }}
              />
            </button>
            
            {showStrokeWidthPicker && (
              <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex flex-col gap-1">
                {strokeWidths.map((width) => (
                  <button
                    key={width}
                    onClick={() => handleStrokeWidthChange(width)}
                    className="flex items-center justify-center p-2 hover:bg-gray-100 rounded"
                  >
                    <div 
                      className="bg-current rounded"
                      style={{ 
                        width: '24px',
                        height: `${width}px`,
                        backgroundColor: myPresence.selectedColor 
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-300 mx-2"></div>

          {/* View Options */}
          <button
            onClick={() => updateAppState({ gridMode: !myPresence.gridMode })}
            className={`p-2 rounded-md transition-colors ${
              myPresence.gridMode 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-50 hover:bg-gray-100'
            } border border-gray-200`}
            title="Toggle Grid"
          >
            <span className="text-sm">⊞</span>
          </button>

          <button
            onClick={() => updateAppState({ zenMode: !myPresence.zenMode })}
            className={`p-2 rounded-md transition-colors ${
              myPresence.zenMode 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-50 hover:bg-gray-100'
            } border border-gray-200`}
            title="Zen Mode"
          >
            <span className="text-sm">👁️</span>
          </button>
        </div>
      </div>

      {/* Mobile Toolbar */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <div className="grid grid-cols-4 gap-2">
            {tools.slice(0, 4).map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolChange(tool.id)}
                className={`p-3 rounded-md transition-colors ${
                  myPresence.selectedTool === tool.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{tool.icon}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
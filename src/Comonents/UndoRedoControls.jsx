import { useHistory, useUndo, useRedo, useCanUndo, useCanRedo } from '../lib/liveblocks';
import { useEffect } from 'react';

export default function UndoRedoControls() {
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')
      ) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center gap-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-2 rounded-md transition-colors ${
            canUndo
              ? 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          } border border-gray-200`}
          title="Undo (Ctrl+Z)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-2 rounded-md transition-colors ${
            canRedo
              ? 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          } border border-gray-200`}
          title="Redo (Ctrl+Shift+Z or Ctrl+Y)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" />
          </svg>
        </button>

        <div className="h-4 w-px bg-gray-300 mx-1"></div>

        <HistoryInfo />
      </div>
    </div>
  );
}

function HistoryInfo() {
  const history = useHistory();
  
  if (!history) return null;

  return (
    <div className="text-xs text-gray-500 px-2">
      {history.currentIndex + 1} / {history.length}
    </div>
  );
}
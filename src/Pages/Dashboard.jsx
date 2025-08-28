import { useState } from 'react';
import RoomWrapper from '../Comonents/RoomWrapper';
import RoomManager from '../Comonents/RoomManager';
import LiveDrawingCanvas from '../Comonents/LiveDrawingCanvas';
import Toolbar from '../Comonents/Toolbar';
import ParticipantsList from '../Comonents/ParticipantsList';
import LiveChat from '../Comonents/LiveChat';
import UndoRedoControls from '../Comonents/UndoRedoControls';
import UserAwareness from '../Comonents/UserAwarness';
export default function Dashboard() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleJoinRoom = (roomId) => {
    setCurrentRoom(roomId);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setIsChatOpen(false);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Room selection view
  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <RoomManager onJoinRoom={handleJoinRoom} />
      </div>
    );
  }

  // Drawing room view
  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <RoomWrapper roomId={currentRoom}>
        {/* Room Header */}
        <div className="absolute top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLeaveRoom}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-md hover:bg-gray-100"
                title="Leave Room"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              
              <div>
                <h1 className="font-semibold text-gray-900">Room: {currentRoom}</h1>
                <div className="text-sm text-gray-500">Collaborative Drawing</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Chat Toggle */}
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`p-2 rounded-md transition-colors ${
                  isChatOpen 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
                title="Toggle Chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                title="Toggle Fullscreen"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                    isFullscreen 
                      ? "M9 9V4.5M9 9H4.5M9 9L3.5 3.5m11 5.5V4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5m11-5.5v4.5m0-4.5h4.5m0 0l-5.5 5.5"
                      : "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  } />
                </svg>
              </button>

              {/* Share Room */}
              <ShareRoomButton roomId={currentRoom} />
            </div>
          </div>
        </div>

        {/* Main Drawing Area */}
        <div className="pt-16 h-full relative">
          <LiveDrawingCanvas />
          
          {/* Drawing Tools */}
          <Toolbar />
          
          {/* Participants */}
          <ParticipantsList />
          
          {/* Undo/Redo Controls */}
          <UndoRedoControls />
          
          {/* User Awareness */}
          <UserAwareness />
          
          {/* Chat */}
          <LiveChat 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
          />
        </div>
      </RoomWrapper>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Limly Draw</h1>
          </div>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
      >
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Profile Settings
            </a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Preferences
            </a>
            <div className="border-t border-gray-200 my-1"></div>
            <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ShareRoomButton({ roomId }) {
  const [copied, setCopied] = useState(false);

  const shareRoom = async () => {
    const shareUrl = `${window.location.origin}/room/${roomId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={shareRoom}
      className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
      title="Share Room"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
      </svg>
      {copied ? 'Copied!' : 'Share'}
    </button>
  );
}
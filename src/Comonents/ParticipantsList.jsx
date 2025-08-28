import { useOthers, useMyPresence } from '../lib/liveblocks';
import { useState } from 'react';

export default function ParticipantsList() {
  const others = useOthers();
  const [myPresence] = useMyPresence();
  const [isExpanded, setIsExpanded] = useState(false);

  const allParticipants = [
    {
      connectionId: 'me',
      info: {
        name: 'You',
        avatar: myPresence.avatar || '/default-avatar.png',
        color: myPresence.color || '#3b82f6',
      },
      presence: myPresence,
    },
    ...others.map(other => ({
      connectionId: other.connectionId,
      info: other.info,
      presence: other.presence,
    }))
  ];

  const maxVisibleParticipants = 5;
  const visibleParticipants = allParticipants.slice(0, maxVisibleParticipants);
  const hiddenCount = Math.max(0, allParticipants.length - maxVisibleParticipants);

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">
            Participants ({allParticipants.length})
          </h3>
          {hiddenCount > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? 'Show less' : `+${hiddenCount} more`}
            </button>
          )}
        </div>

        {/* Participants List */}
        <div className="space-y-2">
          {(isExpanded ? allParticipants : visibleParticipants).map((participant) => (
            <ParticipantItem 
              key={participant.connectionId}
              participant={participant}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ParticipantItem({ participant }) {
  const { connectionId, info, presence } = participant;
  const isMe = connectionId === 'me';

  return (
    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50">
      {/* Avatar */}
      <div className="relative">
        <div 
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-white text-sm font-medium"
          style={{ 
            backgroundColor: info?.color || '#3b82f6',
            borderColor: info?.color || '#3b82f6'
          }}
        >
          {info?.avatar ? (
            <img 
              src={info.avatar} 
              alt={info.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            info?.name?.charAt(0)?.toUpperCase() || '?'
          )}
        </div>
        
        {/* Status indicator */}
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
          presence?.isDrawing ? 'bg-green-500' : 
          presence?.cursor ? 'bg-yellow-500' : 'bg-gray-400'
        }`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-900 truncate">
            {info?.name || `User ${connectionId}`}
            {isMe && (
              <span className="text-xs text-gray-500 ml-1">(You)</span>
            )}
          </span>
        </div>
        
        {/* Status */}
        <div className="text-xs text-gray-500">
          {presence?.isDrawing ? (
            <span className="text-green-600">Drawing...</span>
          ) : presence?.selectedTool ? (
            <span>Using {presence.selectedTool}</span>
          ) : (
            <span>Online</span>
          )}
        </div>
      </div>

      {/* Current tool indicator */}
      {presence?.selectedTool && presence.selectedTool !== 'select' && (
        <div 
          className="w-3 h-3 rounded border"
          style={{ backgroundColor: presence.selectedColor || '#000' }}
          title={`Using ${presence.selectedTool}`}
        />
      )}
    </div>
  );
}
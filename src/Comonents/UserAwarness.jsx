import { useOthers, useMyPresence, useEventListener } from '../lib/liveblocks';
import { useState, useEffect } from 'react';

export default function UserAwareness() {
  const others = useOthers();
  const [myPresence] = useMyPresence();
  const [recentActions, setRecentActions] = useState([]);

  // Listen for user actions
  useEventListener(({ event, user }) => {
    if (event.type === 'element-created' || 
        event.type === 'element-deleted' || 
        event.type === 'element-updated') {
      
      const action = {
        id: Date.now(),
        user,
        type: event.type,
        timestamp: Date.now(),
        elementType: event.elementType,
      };

      setRecentActions(prev => [action, ...prev.slice(0, 4)]);

      // Remove action after 3 seconds
      setTimeout(() => {
        setRecentActions(prev => prev.filter(a => a.id !== action.id));
      }, 3000);
    }
  });

  return (
    <>
      {/* Connection Status */}
      <ConnectionStatus />

      {/* Recent Actions */}
      {recentActions.length > 0 && (
        <div className="fixed top-16 right-4 z-30 space-y-2">
          {recentActions.map((action) => (
            <ActionNotification key={action.id} action={action} />
          ))}
        </div>
      )}

      {/* Active Users Indicator */}
      <ActiveUsersIndicator others={others} />
    </>
  );
}

function ConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState('connected');

  useEffect(() => {
    // You can implement connection status monitoring here
    // This is a simplified version
    const checkConnection = () => {
      if (navigator.onLine) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    };

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    
    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  if (connectionStatus === 'connected') return null;

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        Connection lost. Trying to reconnect...
      </div>
    </div>
  );
}

function ActionNotification({ action }) {
  const actionText = {
    'element-created': 'created',
    'element-deleted': 'deleted',
    'element-updated': 'updated',
  }[action.type];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 animate-slide-in-right">
      <div className="flex items-center gap-2 text-sm">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          {action.user?.info?.avatar ? (
            <img 
              src={action.user.info.avatar} 
              alt={action.user.info.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-xs text-blue-600">
              {action.user?.info?.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          )}
        </div>
        
        <div>
          <span className="font-medium text-gray-900">
            {action.user?.info?.name || 'Someone'}
          </span>
          <span className="text-gray-600 ml-1">
            {actionText} a {action.elementType}
          </span>
        </div>
      </div>
    </div>
  );
}

function ActiveUsersIndicator({ others }) {
  const activeUsers = others.filter(other => 
    other.presence?.cursor || other.presence?.isDrawing
  );

  if (activeUsers.length === 0) return null;

  return (
    <div className="fixed bottom-16 right-4 z-30">
      <div className="bg-green-500 text-white px-3 py-2 rounded-full shadow-lg text-sm flex items-center gap-2">
        <div className="flex -space-x-1">
          {activeUsers.slice(0, 3).map(({ connectionId, info }) => (
            <div
              key={connectionId}
              className="w-6 h-6 rounded-full border-2 border-white bg-green-400 flex items-center justify-center"
            >
              {info?.avatar ? (
                <img 
                  src={info.avatar} 
                  alt={info.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xs">
                  {info?.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              )}
            </div>
          ))}
        </div>
        
        <span>
          {activeUsers.length} active
          {activeUsers.length > 3 && ` (+${activeUsers.length - 3})`}
        </span>
        
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';

import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
// import { v4 as uuidv4 } from 'uuid';

export default function RoomManager({ onJoinRoom }) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Subscribe to user's rooms
    const roomsQuery = query(
      collection(db, 'rooms'),
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(roomsQuery, (snapshot) => {
      const roomsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRooms(roomsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const createRoom = async (roomData) => {
    try {
      const room = {
        ...roomData,
        id: uuidv4(),
        ownerId: user.uid,
        participants: [user.uid],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      await addDoc(collection(db, 'rooms'), room);
      setShowCreateModal(false);
      return room.id;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  };

  const joinRoom = async (roomId) => {
    try {
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        participants: [...rooms.find(r => r.id === roomId)?.participants || [], user.uid],
        updatedAt: new Date(),
      });
      onJoinRoom(roomId);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const leaveRoom = async (roomId) => {
    try {
      const room = rooms.find(r => r.id === roomId);
      if (!room) return;

      const updatedParticipants = room.participants.filter(id => id !== user.uid);
      
      if (updatedParticipants.length === 0) {
        // Delete room if no participants left
        await deleteDoc(doc(db, 'rooms', roomId));
      } else {
        // Update participants list
        await updateDoc(doc(db, 'rooms', roomId), {
          participants: updatedParticipants,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Drawing Rooms</h1>
          <p className="text-gray-600 mt-2">Collaborate with others in real-time</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Room
        </button>
      </div>

      {rooms.length === 0 ? (
        <EmptyState onCreateRoom={() => setShowCreateModal(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              currentUserId={user.uid}
              onJoin={() => joinRoom(room.id)}
              onLeave={() => leaveRoom(room.id)}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createRoom}
        />
      )}

      <RecentRooms onJoinRoom={onJoinRoom} />
    </div>
  );
}

function RoomCard({ room, currentUserId, onJoin, onLeave }) {
  const isOwner = room.ownerId === currentUserId;
  const lastUpdated = room.updatedAt?.toDate?.() || new Date(room.updatedAt);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {room.name}
            </h3>
            
            {room.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {room.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a6 6 0 01-9 5.197" />
                </svg>
                {room.participants?.length || 0} participants
              </span>

              <span>
                {lastUpdated.toLocaleDateString()}
              </span>
            </div>
          </div>

          {isOwner && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Owner
            </span>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onJoin}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Join Room
          </button>

          <button
            onClick={onLeave}
            className="text-gray-600 hover:text-red-600 p-2 rounded-md hover:bg-gray-100"
            title="Leave Room"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onCreateRoom }) {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No rooms yet
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Create your first drawing room to start collaborating with others in real-time.
      </p>
      
      <button
        onClick={onCreateRoom}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
      >
        Create Your First Room
      </button>
    </div>
  );
}

function CreateRoomModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      await onCreate(formData);
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create New Room</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter room name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
              Make room public (others can discover and join)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RecentRooms({ onJoinRoom }) {
  const [recentRooms, setRecentRooms] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Fetch recently accessed rooms
    const fetchRecentRooms = async () => {
      try {
        const recentQuery = query(
          collection(db, 'rooms'),
          where('isPublic', '==', true),
          orderBy('updatedAt', 'desc'),
          // limit(5)
        );
        
        const snapshot = await getDocs(recentQuery);
        const rooms = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).filter(room => !room.participants?.includes(user.uid));
        
        setRecentRooms(rooms.slice(0, 5));
      } catch (error) {
        console.error('Error fetching recent rooms:', error);
      }
    };

    fetchRecentRooms();
  }, [user]);

  if (recentRooms.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Discover Public Rooms
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentRooms.map((room) => (
          <div key={room.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">{room.name}</h3>
            {room.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {room.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {room.participants?.length || 0} participants
              </span>
              
              <button
                onClick={() => onJoinRoom(room.id)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Join →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
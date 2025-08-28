import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Replace with your actual Liveblocks public key
const client = createClient({
  publicApiKey: 'pk_dev_iGECz6JZH3fO7vyV28UjjTXvoj3WqrjXqYGyXpgCgcbdpFlEp_raFQ3TRclL1y24' || "pk_dev_your_key_here",
  
  // Optional: Configure authentication
  async resolveUsers({ userIds }) {
    // Fetch user information from your Firebase database
    const users = [];
    for (const userId of userIds) {
      // Replace with your Firebase user fetching logic
      const user = await fetchUserFromFirebase(userId);
      if (user) {
        users.push({
          id: userId,
          info: {
            name: user.displayName || user.email,
            avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=random`,
          },
        });
      }
    }
    return users;
  },

  // Optional: Resolve mentions
  async resolveMentionSuggestions({ text, roomId }) {
    // Return a list of user IDs that match the query
    return [];
  },
});

// Helper function to fetch user data from Firebase
async function fetchUserFromFirebase(userId) {
  try {
    // Import your Firebase functions here
    // const { doc, getDoc } = await import('firebase/firestore');
    // const { db } = await import('../firebase/config');
    // const userDoc = await getDoc(doc(db, 'users', userId));
    // return userDoc.exists() ? { id: userId, ...userDoc.data() } : null;
    
    // Placeholder - replace with actual Firebase logic
    return {
      id: userId,
      displayName: `User ${userId}`,
      email: `user${userId}@example.com`,
      photoURL: null
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Create room context with TypeScript-like structure
export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useOthers,
  useBroadcastEvent,
  useEventListener,
  useStorage,
  useMutation,
  useHistory,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
  useStatus,
  useLostConnectionListener,
  useErrorListener,
} = createRoomContext(client);

export { client };
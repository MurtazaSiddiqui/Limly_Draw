import { RoomProvider } from '../lib/liveblocks';
import { ClientSideSuspense } from '@liveblocks/react';


export default function RoomWrapper({ roomId, children }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please sign in to access the drawing room.</p>
      </div>
    );
  }

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        selectedTool: 'select',
        selectedColor: '#000000',
        strokeWidth: 2,
      }}
      initialStorage={{
        elements: [],
        appState: {
          viewMode: false,
          zenMode: false,
          gridMode: true,
          currentItemStrokeColor: '#000000',
          currentItemBackgroundColor: 'transparent',
          currentItemFillStyle: 'hachure',
          currentItemStrokeWidth: 1,
          currentItemRoughness: 1,
          currentItemOpacity: 100,
          currentItemFontFamily: 1,
          currentItemFontSize: 20,
          currentItemTextAlign: 'left',
          currentItemStrokeStyle: 'solid',
          currentItemArrowhead: 'arrow',
          currentItemLinearStrokeSharpness: 'round',
          scrollX: 0,
          scrollY: 0,
          zoom: {
            value: 1,
          },
        },
      }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
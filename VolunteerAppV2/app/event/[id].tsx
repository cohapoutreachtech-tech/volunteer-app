// app/event/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
// ✅ CORRECT - relative or alias paths
import { MOCK_EVENTS } from '../../src/data/MockEvents'; // Capital M
import EventDetailView from '../../src/views/EventDetailsView';

export default function EventDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const event = MOCK_EVENTS.find(e => e.id === id);
  
  if (!event) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Event not found</Text>
      </View>
    );
  }
  
  return <EventDetailView event={event} />;
}
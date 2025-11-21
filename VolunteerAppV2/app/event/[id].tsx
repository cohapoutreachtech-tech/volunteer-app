import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { MOCK_EVENTS } from '../../src/data/MockEvents';
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
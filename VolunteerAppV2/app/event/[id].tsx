// app/event/[id].tsx


/*

7) app/event/[id].tsx
Before: Looked up the event using MOCK_EVENTS.find(...) and 
passed it to the view.
After: Uses useEvent(id) to fetch it.
So now the route is responsible for:
reading the route param id
rendering loading/error/not found states
passing the fetched event to EventDetailView
This is the right pattern for real APIs (and works with pagination later).

*/
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useEvent } from '../../src/hooks/useEvent';
import EventDetailView from '../../src/views/EventDetailsView';

export default function EventDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { event, isLoading, error, refetch } = useEvent(id);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading event...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ marginBottom: 8 }}>{error ?? 'Event not found'}</Text>
        <Text style={{ textDecorationLine: 'underline' }} onPress={() => void refetch()}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return <EventDetailView event={event} />;
}

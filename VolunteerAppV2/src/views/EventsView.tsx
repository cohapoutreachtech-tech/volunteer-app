// src/views/EventsView.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventCard from '../components/EventCard';
import { MOCK_EVENTS } from '../data/MockEvents'; // ← IMPORT from shared file

const EventsView = () => {
  const router = useRouter();

  const handleCardPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={MOCK_EVENTS}
        renderItem={({ item }) => (
          <EventCard event={item} onPress={handleCardPress} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.header}>Upcoming Events</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default EventsView;
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl } from 'react-native';
import EventCard from '../components/EventCard';
import { useEvents } from '../hooks/useEvents';
import { TAB_BAR_OVERLAY_HEIGHT } from '../components/navigation/CustomTabBar';

const DashboardView = () => {
  const router = useRouter();
  const { events, isLoading, error, refetch } = useEvents();

  const handleCardPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  // The Header Component (Welcome Message)
  const DashboardHeader = () => (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
        <Text style={styles.headerSubtitle}>
          Welcome back!
        </Text>
      </View>
  );

  if (isLoading) {
    return (
        <View style={styles.center}>
          <Text>Loading dashboard...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={() => void refetch()}>
            Tap to retry
          </Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <FlatList
            data={events}
            renderItem={({ item }) => (
                <EventCard event={item} onPress={handleCardPress} />
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={DashboardHeader}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={() => void refetch()} />
            }
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  listContent: {
    paddingBottom: TAB_BAR_OVERLAY_HEIGHT,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#DC2626',
  },
  retryText: {
    fontSize: 16,
    textDecorationLine: 'underline',
    color: '#312E81',
  },
});

export default DashboardView;
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useFormattedEvent } from '../hooks/useFormattedEvent';
import { Event } from '../models/EventDataModel';

interface EventCardProps {
  event: Event;
  onPress: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const formattedEvent = useFormattedEvent(event);

  if (!formattedEvent) {
    return null;
  }

  const handlePress = () => {
    onPress(formattedEvent.id);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardContainer}>
      {formattedEvent.imageUrl && (
        <Image source={{ uri: formattedEvent.imageUrl }} style={styles.cardImage} />
      )}

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{formattedEvent.title}</Text>
        <Text style={styles.cardDate}>{formattedEvent.displayDate}</Text>
        <Text style={styles.cardLocation}>{formattedEvent.location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      cardImage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      },
      cardContent: {
        padding: 12,
      },
      cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
      },
      cardDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
      },
      cardLocation: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
      },
      cardOverview: {
        fontSize: 14,
        color: '#444',
      },
});

export default EventCard;
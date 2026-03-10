// src/views/EventDetailView.tsx
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFormattedEvent } from '../hooks/useFormattedEvent';
import { Event } from '../models/EventDataModel';

interface EventDetailViewProps {
  event: Event;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({ event }) => {
  const formattedEvent = useFormattedEvent(event);
  
  if (!formattedEvent) {
    return null;
  }
  
  return (
    <ScrollView style={styles.container}>
      {formattedEvent.imageUrl && (
        <Image 
          source={{ uri: formattedEvent.imageUrl }} 
          style={styles.heroImage}
          resizeMode="cover"  
        />
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{formattedEvent.title}</Text>
        <Text style={styles.date}>{formattedEvent.displayDate}</Text>
        <Text style={styles.location}>{formattedEvent.location}</Text>
        
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.body}>{formattedEvent.overviewInfo}</Text>
        
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <Text style={styles.body}>{formattedEvent.additionalInfo}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroImage: {
    width: '100%',
    height: 300,  
    backgroundColor: '#e0e0e0', 
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
});

export default EventDetailView;
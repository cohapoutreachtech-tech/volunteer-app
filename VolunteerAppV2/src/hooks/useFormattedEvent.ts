import { Event } from '../models/EventDataModel';

/**
 * A simple hook that takes raw event data and formats it for the screen.
 */
export const useFormattedEvent = (event: Event) => {
  const displayDate = new Date(event.date).toLocaleTimeString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return {
    id: event.id,
    title: event.eventTitle,
    imageUrl: event.eventImageURL,
    displayDate: displayDate,
    location: event.location,
    // Data below is for the Details Screen
    overviewInfo: event.overviewInfo,
    additionalInfo: event.additionalInfo
  };
};
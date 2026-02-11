// src/data/MockEvents.ts
import { Event } from '../models/EventDataModel';

export const MOCK_EVENTS: Event[] = [
  {
    id: 'event-001',
    eventTitle: 'Community Garden Cleanup',
    eventImageURL: 'https://www.charlestonparksconservancy.org/wp-content/uploads/2023/01/corrine-garden-888x500-c-default.jpg',
    overviewInfo: 'Join us for our annual garden cleanup day! We will be weeding, planting new flowers, and tidying up the community space. Great for all ages.',
    additionalInfo: 'Please bring your own gardening gloves. Water and snacks will be provided.',
    date: '2025-11-15T09:30:00Z',
    location: 'Central Park Community Garden',
  },
  {
    id: 'event-002',
    eventTitle: 'Tech Workshop for Seniors',
    eventImageURL: 'https://www.vintageseniorservices.org/images/tech-support2.jpg',
    overviewInfo: 'A free workshop to help seniors get more comfortable with their smartphones and tablets.',
    additionalInfo: 'The workshop will be held in the library\'s computer lab.',
    date: '2025-11-22T14:00:00Z',
    location: 'Public Library, Room 2B',
  },
];
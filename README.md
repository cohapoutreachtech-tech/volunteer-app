# Cohap Volunteer App - Demo

This repository provides a short demo of the **Cohap Volunteer App**.

**Key Information:**
*   The application was created using **Expo React Native**.
*   This demo utilizes **mock data** for demonstration purposes.
*   Please be aware that the project's dependencies and local environment were configured specifically on a macOS machine. Consequently, direct execution on an individual's machine might require additional setup or dependency adjustments to function correctly.

https://github.com/user-attachments/assets/984e6e29-d097-474f-adfe-77855aec4c88



VolunteerAppV2/
├── app/                  <-- ROUTING LAYER: Defines the "what" and "where".
│   ├── (tabs)/
│   │   ├── _layout.tsx   (Configures the tab bar UI)
│   │   ├── index.tsx     (Route for the first tab)
│   │   ├── profile.tsx   (Route for the third tab)
│   │   └── timesheet.tsx (Route for the second tab)
│   └── _layout.tsx       (Root layout for the entire app, provides global context)
│
└── src/                  <-- IMPLEMENTATION LAYER: Defines the "how".
    ├── components/       (Shared, reusable UI pieces, e.g., cards, buttons)
    │   └── EventCard.tsx
    ├── hooks/            (Reusable logic)
    │   └── useFormattedEvent.ts
    ├── models/           (Data structures and types)
    │   └── EventDataModel.ts
    └── views/            (Full-screen components that are rendered by routes)
        ├── EventsView.tsx
        ├── ProfileView.tsx
        └── TimesheetView.tsx

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

// Common color constants for the app theme
const COLORS = {
    primary: '#312e81', // Indigo
    inactive: '#6b7280',
};

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.inactive,
                tabBarStyle: { paddingBottom: 5, height: 60 },
                tabBarLabelStyle: { fontSize: 12, paddingBottom: 5 },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard', // Changed from "Events"
                    tabBarIcon: ({ color, size }) => (
                        // Changed icon to Home/Speedometer for "Dashboard" feel
                        <Ionicons name="grid" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="shifts"
                options={{
                    title: 'Shifts',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="time" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="announcements"
                options={{
                    title: 'Announcements',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-circle" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
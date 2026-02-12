import { Tabs } from 'expo-router';
import React from 'react';
import CustomTabBar from '../../src/components/navigation/CustomTabBar';

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                }}
            />

            <Tabs.Screen
                name="shifts"
                options={{
                    title: 'Shifts',
                }}
            />

            <Tabs.Screen
                name="announcements"
                options={{
                    title: 'News',
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                }}
            />
        </Tabs>
    );
}
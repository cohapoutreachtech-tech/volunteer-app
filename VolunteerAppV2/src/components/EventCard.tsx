import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useFormattedEvent } from '../hooks/useFormattedEvent';
import { Event } from '../models/EventDataModel';

interface EventCardProps {
    event: Event;
    onPress: (id: string) => void;
}

const THEME = {
    primary: '#312e81',
    textMain: '#111827',
    textSub: '#4B5563',
    bg: '#FFFFFF',
    border: '#E5E7EB',
};

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
    const formattedEvent = useFormattedEvent(event);

    if (!formattedEvent) {
        return null;
    }

    return (
        <View style={styles.cardContainer}>
            {/* 1. Card Image */}
            {formattedEvent.imageUrl && (
                <Image
                    source={{ uri: formattedEvent.imageUrl }}
                    style={styles.cardImage}
                    resizeMode="cover"
                />
            )}

            <View style={styles.cardContent}>
                {/* 2. Title */}
                <Text style={styles.cardTitle}>{formattedEvent.title}</Text>

                {/* 3. Date & Location Rows with Icons */}
                <View style={styles.metaRow}>
                    <Ionicons name="calendar-outline" size={16} color={THEME.textSub} style={styles.icon} />
                    <Text style={styles.metaText}>{formattedEvent.displayDate}</Text>
                </View>

                <View style={styles.metaRow}>
                    <Ionicons name="location-outline" size={16} color={THEME.textSub} style={styles.icon} />
                    <Text style={styles.metaText}>{formattedEvent.location}</Text>
                </View>

                {/* 4. Description Excerpt */}
                <Text style={styles.cardOverview} numberOfLines={2}>
                    {formattedEvent.overviewInfo}
                </Text>

                {/* 5. Progress Bar  */}
                <View style={styles.progressSection}>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: '40%' }]} />
                    </View>
                    <Text style={styles.progressText}>12 / 30 volunteers</Text>
                </View>

                {/* 6. Action Buttons */}
                <View style={styles.buttonRow}>
                    {/* Sign Up Button */}
                    <TouchableOpacity
                        style={[styles.button, styles.buttonPrimary]}
                        onPress={() => console.log('Sign up pressed')} // Placeholder
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonTextPrimary}>Sign Up</Text>
                    </TouchableOpacity>

                    {/* View Details Button */}
                    <TouchableOpacity
                        style={[styles.button, styles.buttonOutline]}
                        onPress={() => onPress(formattedEvent.id)}
                        activeOpacity={0.6}
                    >
                        <Text style={styles.buttonTextOutline}>View Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: THEME.bg,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#E5E7EB',
    },
    cardContent: {
        padding: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: THEME.textMain,
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    icon: {
        marginRight: 6,
        marginTop: 1,
    },
    metaText: {
        fontSize: 14,
        color: THEME.textSub,
        fontWeight: '500',
    },
    cardOverview: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },

    progressSection: {
        marginTop: 16,
        marginBottom: 20,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        marginBottom: 6,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: THEME.primary,
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },

    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPrimary: {
        backgroundColor: THEME.primary,
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: THEME.primary,
    },
    buttonTextPrimary: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    buttonTextOutline: {
        color: THEME.primary,
        fontSize: 14,
        fontWeight: '700',
    },
});

export default EventCard;
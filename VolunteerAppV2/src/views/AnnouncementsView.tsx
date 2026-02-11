import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_OVERLAY_HEIGHT } from '../components/navigation/CustomTabBar';

// --- 1. THEME CONSTANTS ---
const THEME = {
    primary: '#312e81', // Indigo
    primaryLight: '#e0e7ff',
    bg: '#F3F4F6',
    card: '#FFFFFF',
    textMain: '#111827',
    textSub: '#6B7280',
    accent: '#3b82f6', // Bright Blue for "New" badges
    border: '#E5E7EB',
};

// --- 2. HARDCODED DATA ---
const MOCK_ANNOUNCEMENTS = [
    {
        id: '1',
        title: 'Food Drive This Saturday',
        date: 'Oct 19, 2025',
        content:
            'Reminder about the food drive event this Saturday at 9 AM. Please arrive 15 minutes early to help set up the booths.',
        author: 'Admin User',
        isNew: true,
        hasAttachment: false,
        likes: 5,
    },
    {
        id: '2',
        title: 'New Volunteer Orientation',
        date: 'Oct 17, 2025',
        content:
            'Welcome to all new volunteers! Please attend the orientation session next week to get your badges and uniforms.',
        author: 'Admin User',
        isNew: false,
        hasAttachment: false,
        likes: 12,
    },
    {
        id: '3',
        title: 'Meet at the Circle @ 5pm',
        date: 'Oct 14, 2025',
        content:
            'All Volunteers make sure to carry Umbrellas and meet at the Walb Circle @ 5pm. PFA a map of the location.',
        author: 'Admin User',
        isNew: true,
        hasAttachment: true,
        attachmentName: 'Location_Map.pdf',
        likes: 8,
    },
    {
        id: '4',
        title: 'Winter Schedule Changes',
        date: 'Oct 10, 2025',
        content:
            'Please note that starting November 1st, evening shifts will end one hour earlier due to daylight savings.',
        author: 'Coordinator',
        isNew: false,
        hasAttachment: false,
        likes: 3,
    },
];

// --- 3. ANNOUNCEMENT CARD ---
const AnnouncementCard = ({ item }: { item: typeof MOCK_ANNOUNCEMENTS[0] }) => {
    const [liked, setLiked] = useState(false);

    return (
        <View style={styles.card}>
            <View
                style={[
                    styles.cardAccent,
                    { backgroundColor: item.isNew ? THEME.primary : '#9CA3AF' },
                ]}
            />

            <View style={styles.cardContent}>
                <View style={styles.cardHeaderRow}>
                    {item.isNew && (
                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>NEW</Text>
                        </View>
                    )}
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>

                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.bodyText}>{item.content}</Text>

                {item.hasAttachment && (
                    <TouchableOpacity style={styles.attachmentBtn} activeOpacity={0.7}>
                        <Ionicons name="attach" size={20} color={THEME.primary} />
                        <Text style={styles.attachmentText}>
                            {item.attachmentName || 'Has attachment (tap to view)'}
                        </Text>
                    </TouchableOpacity>
                )}

                <View style={styles.footerRow}>
                    <Text style={styles.authorText}>Posted by {item.author}</Text>

                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[styles.iconBtn, liked && styles.iconBtnActive]}
                            onPress={() => setLiked(!liked)}
                        >
                            <Ionicons
                                name={liked ? 'thumbs-up' : 'thumbs-up-outline'}
                                size={20}
                                color={liked ? '#FFFFFF' : THEME.primary}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.detailsBtn}
                            onPress={() => Alert.alert('Details', 'Navigating to details...')}
                        >
                            <Text style={styles.detailsBtnText}>View</Text>
                            <Ionicons name="arrow-forward" size={16} color={THEME.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

// --- 4. MAIN VIEW COMPONENT ---
export default function AnnouncementsView() {
    const insets = useSafeAreaInsets();
    const unreadCount = MOCK_ANNOUNCEMENTS.filter((a) => a.isNew).length;

    const renderHeader = () => (
        <View style={styles.screenHeader}>
            <View>
                <Text style={styles.headerSubtitle}>Latest news and updates</Text>
            </View>

            {unreadCount > 0 && (
                <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>{unreadCount} New</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.root}>

            <View style={styles.container}>
                <FlatList
                    data={MOCK_ANNOUNCEMENTS}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <AnnouncementCard item={item} />}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

// --- 5. STYLES ---
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: THEME.bg,
    },
    listContent: {
        paddingHorizontal: 12,
        paddingBottom: TAB_BAR_OVERLAY_HEIGHT,
    },

    screenHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: THEME.textMain,
    },
    headerSubtitle: {
        fontSize: 14,
        color: THEME.textSub,
        marginTop: 2,
    },
    headerBadge: {
        backgroundColor: THEME.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    headerBadgeText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
    },

    card: {
        flexDirection: 'row',
        backgroundColor: THEME.card,
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardAccent: {
        width: 6,
        height: '100%',
    },
    cardContent: {
        flex: 1,
        padding: 16,
    },

    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    newBadge: {
        backgroundColor: '#4338ca',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8,
    },
    newBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    dateText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginLeft: 'auto',
    },

    titleText: {
        fontSize: 18,
        fontWeight: '700',
        color: THEME.textMain,
        marginBottom: 8,
    },
    bodyText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
        marginBottom: 12,
    },

    attachmentBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    attachmentText: {
        color: THEME.primary,
        fontSize: 13,
        fontWeight: '500',
        marginLeft: 8,
    },

    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
    },
    authorText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 8,
    },

    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBtnActive: {
        backgroundColor: THEME.primary,
    },
    detailsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: THEME.primaryLight,
        backgroundColor: '#FFFFFF',
    },
    detailsBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: THEME.primary,
        marginRight: 4,
    },
});

import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
    Animated,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Easing,
} from 'react-native';
import type { VolunteerHoursEntry } from '../models/VolunteerHours';

// --- TYPES ---
type TimerState = {
    isRunning: boolean;
    elapsedSeconds: number;
    startedLabel?: string;
};

type Props = {
    timer: TimerState;
    onPressPrimary: () => void;
    pending: VolunteerHoursEntry[];
    approved: VolunteerHoursEntry[];
};

// --- THEME ---
const THEME = {
    indigo: '#312e81',
    red: '#dc2626',
    redFaded: 'rgba(220, 38, 38, 0.15)',
    bg: '#f3f4f6',
    cardBg: '#ffffff',
    textMain: '#111827',
    textSub: '#6b7280',
    pendingBg: '#fef3c7',
    pendingText: '#b45309',
    approvedBg: '#dcfce7',
    approvedText: '#15803d',
};

// --- HELPER FUNCTIONS ---
function formatHMS(totalSeconds: number): string {
    const s = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
        seconds
    ).padStart(2, '0')}`;
}

// --- SUB-COMPONENTS ---

// 1. Status Badge
function StatusBadge({ variant }: { variant: 'pending' | 'approved' }) {
    const isPending = variant === 'pending';
    return (
        <View
            style={[
                styles.badge,
                { backgroundColor: isPending ? THEME.pendingBg : THEME.approvedBg },
            ]}
        >
            <Text
                style={[
                    styles.badgeText,
                    { color: isPending ? THEME.pendingText : THEME.approvedText },
                ]}
            >
                {isPending ? 'Pending' : 'Approved'}
            </Text>
        </View>
    );
}

// 2. Log Card
function ShiftCard({
                       entry,
                       variant,
                   }: {
    entry: VolunteerHoursEntry;
    variant: 'pending' | 'approved';
}) {
    const dateStr = entry.shiftDate ? new Date(entry.shiftDate).toLocaleDateString() : '—';

    return (
        <View style={styles.logCard}>
            <View style={{ flex: 1 }}>
                <Text style={styles.logDate}>{dateStr}</Text>
                <Text style={styles.logTime}>
                    {entry.clockIn} - {entry.clockOut || '...'}
                </Text>
            </View>
            <View style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <StatusBadge variant={variant} />
                <Text style={styles.logHours}>
                    {entry.totalHours ? `${Number(entry.totalHours).toFixed(2)} Hours` : '--'}
                </Text>
            </View>
        </View>
    );
}

// 3. Animated Hold-To-Stop Button
function HoldToStopButton({ onComplete }: { onComplete: () => void }) {
    const progress = useRef(new Animated.Value(0)).current;

    const ANIMATION_DURATION = 1500; // 1.5 seconds to hold
    const BUTTON_SIZE = 80;
    const MAX_SCALE = 1.6; // How big the ring gets

    const handlePressIn = () => {
        Animated.timing(progress, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            easing: Easing.linear,
            useNativeDriver: true, // transform + opacity are supported
        }).start(({ finished }) => {
            if (finished) {
                onComplete();
                progress.setValue(0);
            }
        });
    };

    const handlePressOut = () => {
        // FIX: stop animation correctly (Animated.timing(progress).stop() is invalid)
        progress.stopAnimation();

        Animated.spring(progress, {
            toValue: 0,
            useNativeDriver: true,
            friction: 6,
            tension: 100,
        }).start();
    };

    const scale = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, MAX_SCALE],
    });

    const opacity = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <View style={{ alignItems: 'center', marginTop: 10 }}>
            <View style={[styles.holdButtonContainer, { width: BUTTON_SIZE, height: BUTTON_SIZE }]}>
                {/* The Animated Ring/Gauge */}
                <Animated.View
                    style={[
                        styles.holdButtonRing,
                        {
                            width: BUTTON_SIZE,
                            height: BUTTON_SIZE,
                            borderRadius: BUTTON_SIZE / 2,
                            transform: [{ scale }],
                            opacity,
                        },
                    ]}
                />

                {/* The Time Button */}
                <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={({ pressed }) => [
                        styles.holdButtonInner,
                        {
                            width: BUTTON_SIZE,
                            height: BUTTON_SIZE,
                            borderRadius: BUTTON_SIZE / 2,
                            transform: [{ scale: pressed ? 0.95 : 1 }],
                        },
                    ]}
                >
                    <Ionicons name="square" size={24} color="white" />
                </Pressable>
            </View>
            <Text style={styles.holdLabel}>Hold to End Shift</Text>
        </View>
    );
}

// --- MAIN VIEW ---
export default function ShiftsView({ timer, onPressPrimary, pending, approved }: Props) {

    return (
        <View style={[styles.screen]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* --- MAIN INTERACTION AREA --- */}
                <View style={styles.mainCard}>
                    {!timer.isRunning ? (
                        <TouchableOpacity activeOpacity={0.8} onPress={onPressPrimary} style={styles.bigCircleButton}>
                            <Ionicons name="time" size={48} color="white" />
                            <Text style={styles.bigButtonText}>Start Shift</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.timerContainer}>
                            <Text style={styles.timerDisplay}>{formatHMS(timer.elapsedSeconds)}</Text>
                            <Text style={styles.timerSubText}>{timer.startedLabel ?? 'Shift in progress'}</Text>

                            <HoldToStopButton onComplete={onPressPrimary} />
                        </View>
                    )}
                </View>

                {/* --- LOGS SECTION --- */}
                <View style={styles.logsSection}>
                    <Text style={styles.sectionHeader}>Pending Approval</Text>
                    {pending.map((item) => (
                        <ShiftCard key={item.id} entry={item} variant="pending" />
                    ))}
                    {pending.length === 0 && <Text style={styles.emptyText}>No pending items</Text>}

                    <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Approved Shifts</Text>
                    {approved.map((item) => (
                        <ShiftCard key={item.id} entry={item} variant="approved" />
                    ))}
                    {approved.length === 0 && <Text style={styles.emptyText}>No approved items</Text>}
                </View>

                {/* Bottom padding for tab bar */}
                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: THEME.bg,
    },
    scrollContent: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
        color: THEME.textMain,
    },

    // CARD
    mainCard: {
        backgroundColor: THEME.cardBg,
        borderRadius: 24,
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginBottom: 30,
        minHeight: 320,
    },

    // BIG START BUTTON
    bigCircleButton: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: THEME.indigo,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: THEME.indigo,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 4,
        borderColor: '#e0e7ff',
    },
    bigButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },

    // TIMER DISPLAY
    timerContainer: {
        alignItems: 'center',
        width: '100%',
    },
    timerDisplay: {
        fontSize: 48,
        fontVariant: ['tabular-nums'],
        fontWeight: '700',
        color: THEME.textMain,
        marginBottom: 8,
    },
    timerSubText: {
        color: THEME.textSub,
        marginBottom: 20,
    },

    // HOLD BUTTON STYLES
    holdButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    holdButtonInner: {
        backgroundColor: THEME.red,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: THEME.red,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
        zIndex: 2,
    },
    holdButtonRing: {
        position: 'absolute',
        backgroundColor: THEME.redFaded,
        zIndex: 1,
    },
    holdLabel: {
        color: THEME.textSub,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // LOGS
    logsSection: {
        marginTop: 10,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: THEME.textSub,
        marginBottom: 12,
    },
    logCard: {
        backgroundColor: THEME.cardBg,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    logDate: {
        fontWeight: 'bold',
        color: THEME.textMain,
        fontSize: 15,
    },
    logTime: {
        color: THEME.textSub,
        marginTop: 4,
        fontSize: 13,
    },
    logHours: {
        fontWeight: 'bold',
        color: THEME.indigo,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 4,
        alignSelf: 'flex-end',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    emptyText: {
        color: THEME.textSub,
        fontStyle: 'italic',
        marginBottom: 16,
    },
});


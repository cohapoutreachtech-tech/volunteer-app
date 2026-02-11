import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef } from 'react';
import {
    Animated,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Easing,
    Alert,
    PanResponder,
} from 'react-native';
import { THEME as APP_THEME } from '../../app/(onboarding)/theme';
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

// --- DESIGN TOKENS ---
// Use app theme where possible; extend for status colors used in the mockups.
const TOKENS = {
    ...APP_THEME,

    // This prompt's spec uses white/gray surfaces. Our current onboarding theme uses an indigo backdrop
    // + translucent cards. To match the mockups, we follow the mock token set for surfaces/typography.
    bg: '#F3F4F6',
    card: '#FFFFFF',
    textMain: '#111827',
    textSub: '#6B7280',
    border: '#E5E7EB',

    primary: '#312e81',
    primaryLight: '#e0e7ff',
    accent: '#3b82f6',

    approved: '#059669',
    approvedBg: '#ecfdf5',

    pending: '#f59e0b',
    pendingBg: '#fffbeb',
} as const;

// --- HELPERS ---
function formatHMS(totalSeconds: number): { h: string; m: string; s: string } {
    const t = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;

    return {
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
    };
}

function formatDateLabel(dateValue: unknown): string {
    if (!dateValue) return '—';
    const d = new Date(String(dateValue));
    if (Number.isNaN(d.getTime())) return '—';

    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

// --- SUB-COMPONENTS ---

function Header({ isRunning }: { isRunning: boolean }) {
    // Header removed per request.
    return null;
}

function Card({ stripeColor, children }: { stripeColor: string; children: React.ReactNode }) {
    return (
        <View style={styles.cardOuter}>
            <View style={[styles.cardStripe, { backgroundColor: stripeColor }]} />
            <View style={styles.cardInner}>{children}</View>
        </View>
    );
}

function QRRow({ onPress }: { onPress: () => void }) {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.qrRowCard}>
            <View style={styles.qrIconWrap}>
                <Ionicons name="qr-code-outline" size={18} color={TOKENS.accent} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.qrTitle}>Scan QR Code</Text>
                <Text style={styles.qrSubtitle}>Check in at your location</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={stylesVars.chevron} />
        </TouchableOpacity>
    );
}

function SectionHeader({ children }: { children: string }) {
    return <Text style={styles.sectionHeader}>{children}</Text>;
}

function HistoryGroup({ children }: { children: React.ReactNode }) {
    return <View style={styles.historyGroupCard}>{children}</View>;
}

function HistoryEmpty({ label }: { label: string }) {
    return (
        <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={20} color={stylesVars.mutedIcon} />
            <Text style={styles.emptyStateText}>{label}</Text>
        </View>
    );
}

function HistoryRow({ entry, variant }: { entry: VolunteerHoursEntry; variant: 'pending' | 'approved' }) {
    const isApproved = variant === 'approved';

    const dateStr = formatDateLabel(entry.shiftDate);
    const timeRange = `${entry.clockIn ?? '—'} – ${entry.clockOut ?? '—'}`;

    const hoursText = entry.totalHours ? `${Number(entry.totalHours).toFixed(2)} hrs` : '--';

    const iconBg = isApproved ? TOKENS.approvedBg : TOKENS.pendingBg;
    const iconColor = isApproved ? TOKENS.approved : TOKENS.pending;
    const labelColor = iconColor;

    return (
        <Pressable style={({ pressed }) => [styles.historyRow, pressed && { opacity: 0.7 }]}>
            <View style={[styles.historyIconCircle, { backgroundColor: iconBg }]}>
                <Ionicons
                    name={isApproved ? 'checkmark' : 'time-outline'}
                    size={15}
                    color={iconColor}
                />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.historyDate}>{dateStr}</Text>
                <Text style={styles.historyTime}>{timeRange}</Text>
            </View>

            <View style={styles.historyRight}>
                <Text style={styles.historyHours}>{hoursText}</Text>
                <Text style={[styles.historyStatus, { color: labelColor }]}>
                    {isApproved ? 'Approved' : 'Pending'}
                </Text>
            </View>

            <Ionicons name="chevron-forward" size={16} color={stylesVars.chevron} />
        </Pressable>
    );
}

function Divider() {
    return <View style={styles.divider} />;
}

function TimerDisplay({ elapsedSeconds }: { elapsedSeconds: number }) {
    const colonAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const anim = Animated.loop(
            Animated.sequence([
                Animated.timing(colonAnim, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(colonAnim, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        anim.start();
        return () => colonAnim.stopAnimation();
    }, [colonAnim]);

    const colonOpacity = colonAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] });

    const t = formatHMS(elapsedSeconds);

    return (
        <View style={styles.timerDigitsRow}>
            <Text style={styles.timerDigit}>{t.h}</Text>
            <Animated.Text style={[styles.timerColon, { opacity: colonOpacity }]}>:</Animated.Text>
            <Text style={styles.timerDigit}>{t.m}</Text>
            <Animated.Text style={[styles.timerColon, { opacity: colonOpacity }]}>:</Animated.Text>
            <Text style={styles.timerDigit}>{t.s}</Text>
        </View>
    );
}

function RunningTimerHero({ elapsedSeconds, startedLabel }: { elapsedSeconds: number; startedLabel?: string }) {
    const glow = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const anim = Animated.loop(
            Animated.sequence([
                Animated.timing(glow, {
                    toValue: 1,
                    duration: 1250,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(glow, {
                    toValue: 0,
                    duration: 1250,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        anim.start();
        return () => glow.stopAnimation();
    }, [glow]);

    const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
    const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.15] });

    // Parse "Shift started at 9:41 AM" -> show "Started at" + bold time.
    const startedText = startedLabel?.replace(/^Shift\s+/i, '') ?? 'Started at —';

    const { prefix, time } = useMemo(() => {
        const match = startedText.match(/^(Started at)\s+(.*)$/i);
        if (!match) return { prefix: 'Started at', time: '—' };
        return { prefix: match[1], time: match[2] };
    }, [startedText]);

    return (
        <View style={styles.runningHero}>
            <View style={styles.timerRingWrap}>
                <Animated.View
                    style={[
                        styles.timerGlow,
                        {
                            transform: [{ scale: glowScale }],
                            opacity: glowOpacity,
                        },
                    ]}
                />

                <View style={styles.timerRingOuter}>
                    <View style={styles.timerRingInner}>
                        <TimerDisplay elapsedSeconds={elapsedSeconds} />
                    </View>
                </View>
            </View>

            <Text style={styles.startedAtLine}>
                {prefix}{' '}
                <Text style={styles.startedAtTime}>{time}</Text>
            </Text>
        </View>
    );
}

function HoldToEndRail({ onComplete }: { onComplete: () => void }) {
    // Replace hold-to-complete with a real slide gesture.
    const railWidth = useRef(0);
    const translateX = useRef(new Animated.Value(0)).current;

    const THUMB_SIZE = 48;
    const THUMB_MARGIN_LEFT = 2;

    const resetThumb = () => {
        Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 7,
            tension: 90,
        }).start();
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Horizontal intent
                return Math.abs(gestureState.dx) > 4 && Math.abs(gestureState.dy) < 12;
            },
            onPanResponderGrant: () => {
                // stop any running animations
                translateX.stopAnimation();
            },
            onPanResponderMove: (_, gestureState) => {
                const maxX = Math.max(0, railWidth.current - THUMB_SIZE - THUMB_MARGIN_LEFT * 2);
                const next = Math.max(0, Math.min(maxX, gestureState.dx));
                translateX.setValue(next);
            },
            onPanResponderRelease: () => {
                const maxX = Math.max(0, railWidth.current - THUMB_SIZE - THUMB_MARGIN_LEFT * 2);
                const threshold = maxX * 0.9;

                translateX.stopAnimation((value) => {
                    if (value >= threshold && maxX > 0) {
                        Animated.timing(translateX, {
                            toValue: maxX,
                            duration: 120,
                            easing: Easing.out(Easing.ease),
                            useNativeDriver: true,
                        }).start(({ finished }) => {
                            if (finished) {
                                onComplete();
                                // reset for next time (screen will likely switch states, but keep it safe)
                                translateX.setValue(0);
                            }
                        });
                    } else {
                        resetThumb();
                    }
                });
            },
            onPanResponderTerminate: resetThumb,
        })
    ).current;

    return (
        <View
            style={styles.railContainer}
            onLayout={(e) => {
                railWidth.current = e.nativeEvent.layout.width;
            }}
        >
            {/* track label */}
            <Text style={styles.railLabel} pointerEvents="none">
                Slide to End Shift →
            </Text>

            {/* thumb */}
            <Animated.View
                style={[
                    styles.railThumb,
                    {
                        transform: [{ translateX }],
                    },
                ]}
                {...panResponder.panHandlers}
            >
                <Ionicons name="square" size={16} color={TOKENS.primaryLight} />
            </Animated.View>
        </View>
    );
}

// --- MAIN VIEW ---
export default function ShiftsView({ timer, onPressPrimary, pending, approved }: Props) {
    const handleScanQrPress = () => {
        Alert.alert('Coming soon', 'QR code scanning will be available in a future update.');
    };

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* HERO */}
                <Card stripeColor={timer.isRunning ? TOKENS.accent : TOKENS.primary}>
                    {!timer.isRunning ? (
                        <View style={styles.idleHero}>
                            <View style={styles.idleIconCircle}>
                                <Ionicons name="time-outline" size={28} color={TOKENS.primary} />
                            </View>

                            <Text style={styles.idleLine1}>No active shift</Text>
                            <Text style={styles.idleLine2}>
                                Start a shift to begin tracking your volunteer time
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={onPressPrimary}
                                style={styles.startCta}
                            >
                                <Ionicons name="play" size={18} color={TOKENS.primaryLight} style={{ marginRight: 8 }} />
                                <Text style={styles.startCtaText}>Start Shift</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.runningHeroWrap}>
                            <RunningTimerHero
                                elapsedSeconds={timer.elapsedSeconds}
                                startedLabel={timer.startedLabel}
                            />

                            <HoldToEndRail onComplete={onPressPrimary} />
                        </View>
                    )}
                </Card>

                {/* QR */}
                <View style={{ height: 12 }} />
                <QRRow onPress={handleScanQrPress} />

                {/* HISTORY */}
                <View style={{ height: 24 }} />

                <SectionHeader>PENDING APPROVAL</SectionHeader>
                <HistoryGroup>
                    {pending.length === 0 ? (
                        <HistoryEmpty label="No pending shifts" />
                    ) : (
                        pending.map((e, idx) => (
                            <React.Fragment key={e.id}>
                                <HistoryRow entry={e} variant="pending" />
                                {idx < pending.length - 1 && <Divider />}
                            </React.Fragment>
                        ))
                    )}
                </HistoryGroup>

                <View style={{ height: 24 }} />
                <SectionHeader>APPROVED SHIFTS</SectionHeader>
                <HistoryGroup>
                    {approved.length === 0 ? (
                        <HistoryEmpty label="No approved shifts" />
                    ) : (
                        approved.map((e, idx) => (
                            <React.Fragment key={e.id}>
                                <HistoryRow entry={e} variant="approved" />
                                {idx < approved.length - 1 && <Divider />}
                            </React.Fragment>
                        ))
                    )}
                </HistoryGroup>

                {/* bottom safe spacer */}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const stylesVars = {
    chevron: 'rgba(107,114,128,0.4)',
    mutedIcon: 'rgba(107,114,128,0.3)',
} as const;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: TOKENS.bg,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },

    // Title
    titleBlock: {
        paddingTop: 16,
        paddingBottom: 8,
    },
    screenTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: TOKENS.textMain,
        letterSpacing: -0.4,
    },
    screenSubtitleIdle: {
        marginTop: 6,
        fontSize: 15,
        color: TOKENS.textSub,
    },
    runningSubtitleRow: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    runningDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: TOKENS.accent,
        marginRight: 8,
    },
    screenSubtitleRunning: {
        fontSize: 15,
        fontWeight: '600',
        color: TOKENS.accent,
    },

    // Cards
    cardOuter: {
        backgroundColor: TOKENS.card,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: TOKENS.border,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },
    cardStripe: {
        height: 4,
        width: '100%',
    },
    cardInner: {
        padding: 24,
    },

    // Idle Hero
    idleHero: {
        alignItems: 'center',
        paddingTop: 8,
    },
    idleIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: TOKENS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    idleLine1: {
        fontSize: 13,
        color: TOKENS.textSub,
        marginBottom: 6,
    },
    idleLine2: {
        fontSize: 12,
        color: 'rgba(107,114,128,0.7)',
        textAlign: 'center',
        maxWidth: 220,
        lineHeight: 16,
        marginBottom: 20,
    },
    startCta: {
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 14,
        backgroundColor: TOKENS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: TOKENS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 3,
    },
    startCtaText: {
        fontSize: 16,
        fontWeight: '600',
        color: TOKENS.primaryLight,
    },

    // Running Hero
    runningHeroWrap: {
        paddingTop: 4,
        alignItems: 'center',
    },
    runningHero: {
        alignItems: 'center',
    },
    timerRingWrap: {
        width: 164,
        height: 164,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    timerGlow: {
        position: 'absolute',
        width: 164,
        height: 164,
        borderRadius: 82,
        backgroundColor: TOKENS.accent,
        opacity: 0.1,
    },
    timerRingOuter: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 3,
        borderColor: 'rgba(59,130,246,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    timerRingInner: {
        width: 132,
        height: 132,
        borderRadius: 66,
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    timerDigitsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerDigit: {
        fontSize: 38,
        fontWeight: '800',
        color: TOKENS.textMain,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontVariant: ['tabular-nums'],
    },
    timerColon: {
        fontSize: 38,
        fontWeight: '800',
        color: TOKENS.textMain,
        marginHorizontal: 2,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },

    startedAtLine: {
        fontSize: 13,
        color: TOKENS.textSub,
        marginBottom: 20,
    },
    startedAtTime: {
        fontWeight: '600',
        color: TOKENS.textMain,
    },

    // Rail
    railContainer: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(49,46,129,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(49,46,129,0.15)',
        overflow: 'hidden',
        justifyContent: 'center',
    },
    railFill: {
        // no longer used (slide is real; keep style for possible future use)
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(49,46,129,0.10)',
    },
    railLabel: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(49,46,129,0.4)',
    },
    railThumb: {
        position: 'absolute',
        left: 0,
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: TOKENS.primary,
        marginLeft: 2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: TOKENS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 3,
    },

    // QR Row
    qrRowCard: {
        backgroundColor: TOKENS.card,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: TOKENS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 12,
    },
    qrIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: 'rgba(59,130,246,0.10)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: TOKENS.textMain,
        marginBottom: 2,
    },
    qrSubtitle: {
        fontSize: 12,
        color: TOKENS.textSub,
    },

    // History
    sectionHeader: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: TOKENS.textSub,
        paddingLeft: 16,
        paddingBottom: 6,
    },
    historyGroupCard: {
        backgroundColor: TOKENS.card,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: TOKENS.border,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },
    divider: {
        height: 1,
        backgroundColor: TOKENS.border,
    },
    historyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        columnGap: 12,
    },
    historyIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyDate: {
        fontSize: 14,
        fontWeight: '500',
        color: TOKENS.textMain,
    },
    historyTime: {
        marginTop: 2,
        fontSize: 12,
        color: TOKENS.textSub,
    },
    historyRight: {
        alignItems: 'flex-end',
        marginRight: 2,
    },
    historyHours: {
        fontSize: 14,
        fontWeight: '600',
        color: TOKENS.textMain,
    },
    historyStatus: {
        marginTop: 2,
        fontSize: 11,
        fontWeight: '500',
    },

    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    emptyStateText: {
        marginTop: 8,
        fontSize: 13,
        color: 'rgba(107,114,128,0.60)',
    },
});

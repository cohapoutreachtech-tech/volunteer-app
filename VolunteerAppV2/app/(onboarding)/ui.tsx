// app/(onboarding)/ui.tsx
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Switch,
    Platform,
    Animated,
    Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { THEME } from "./theme";

export function ProgressDots({ current }: { current: 1 | 2 | 3 | 4 }) {
    return (
        <View style={styles.progressRow}>
            {[1, 2, 3, 4].map((n) => (
                <View key={n} style={[styles.dot, n <= current ? styles.dotActive : styles.dotIdle]}>
                    <Text style={[styles.dotText, n <= current ? styles.dotTextActive : styles.dotTextIdle]}>{n}</Text>
                </View>
            ))}
        </View>
    );
}

export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <View style={{ marginBottom: 12 }}>
            <Text style={styles.hTitle}>{title}</Text>
            {!!subtitle && <Text style={styles.hSub}>{subtitle}</Text>}
        </View>
    );
}

export function SectionTitle({ children }: { children: string }) {
    return <Text style={styles.section}>{children}</Text>;
}

export function PillChoice({
                               label,
                               selected,
                               onPress,
                           }: {
    label: string;
    selected: boolean;
    onPress: () => void;
}) {
    const { scale, pressIn, pressOut } = usePressScale();

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
                onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    onPress();
                }}
                onPressIn={pressIn}
                onPressOut={pressOut}
                style={({ pressed }) => [
                    styles.pill,
                    selected ? styles.pillOn : styles.pillOff,
                    pressed && styles.pressed,
                ]}
            >
                <Text style={[styles.pillText, selected ? styles.pillTextOn : styles.pillTextOff]}>{label}</Text>
            </Pressable>
        </Animated.View>
    );
}

export function CheckboxRow({
                                label,
                                value,
                                onChange,
                            }: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
}) {
    const { scale, pressIn, pressOut } = usePressScale(0.99);
    const fill = React.useRef(new Animated.Value(value ? 1 : 0)).current;

    React.useEffect(() => {
        Animated.timing(fill, {
            toValue: value ? 1 : 0,
            duration: 160,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
        }).start();
    }, [value, fill]);

    const bg = fill.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgba(49,46,129,0)", THEME.primary],
    });

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
                onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    onChange(!value);
                }}
                onPressIn={pressIn}
                onPressOut={pressOut}
                style={({ pressed }) => [styles.checkRow, pressed && styles.pressed]}
            >
                <View style={[styles.checkBox, value && styles.checkBoxOn]}>
                    <Animated.View
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 6,
                            backgroundColor: bg,
                        }}
                    />
                </View>
                <Text style={styles.checkLabel}>{label}</Text>
            </Pressable>
        </Animated.View>
    );
}

export function ToggleRow({
                              label,
                              value,
                              onChange,
                          }: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <View style={styles.toggleRow}>
            <Text style={styles.checkLabel}>{label}</Text>
            <Switch value={value} onValueChange={onChange} />
        </View>
    );
}

export function FooterNav({
                              backLabel = "Back",
                              nextLabel = "Continue",
                              onBack,
                              onNext,
                              nextVariant = "primary",
                          }: {
    backLabel?: string;
    nextLabel?: string;
    onBack?: () => void;
    onNext: () => void;
    nextVariant?: "primary" | "success";
}) {
    const { scale: nextScale, pressIn: nextPressIn, pressOut: nextPressOut } = usePressScale();
    const { scale: backScale, pressIn: backPressIn, pressOut: backPressOut } = usePressScale();

    return (
        <View style={styles.footer}>
            {onBack ? (
                <Animated.View style={{ flex: 1, transform: [{ scale: backScale }] }}>
                    <Pressable
                        style={({ pressed }) => [styles.footerBtnGhost, pressed && styles.pressed]}
                        onPress={() => {
                            Haptics.selectionAsync().catch(() => {});
                            onBack();
                        }}
                        onPressIn={backPressIn}
                        onPressOut={backPressOut}
                    >
                        <Text style={styles.footerGhostText}>{backLabel}</Text>
                    </Pressable>
                </Animated.View>
            ) : (
                <View style={{ flex: 1 }} />
            )}

            <Animated.View style={{ flex: 1, transform: [{ scale: nextScale }] }}>
                <Pressable
                    style={({ pressed }) => [
                        styles.footerBtn,
                        nextVariant === "success" ? styles.footerBtnSuccess : styles.footerBtnPrimary,
                        pressed && styles.pressed,
                    ]}
                    onPress={() => {
                        Haptics.selectionAsync().catch(() => {});
                        onNext();
                    }}
                    onPressIn={nextPressIn}
                    onPressOut={nextPressOut}
                >
                    {nextVariant === "success" && (
                        <LinearGradient
                            colors={["#11998e", "#38ef7d"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.successGradient}
                        />
                    )}
                    <Text style={styles.footerBtnText}>{nextLabel}</Text>
                </Pressable>
            </Animated.View>
        </View>
    );
}

function usePressScale(scaleTo: number = 0.98) {
    const scale = React.useRef(new Animated.Value(1)).current;

    const pressIn = React.useCallback(() => {
        Animated.spring(scale, {
            toValue: scaleTo,
            useNativeDriver: true,
            speed: 30,
            bounciness: 0,
        }).start();
    }, [scale, scaleTo]);

    const pressOut = React.useCallback(() => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 30,
            bounciness: 0,
        }).start();
    }, [scale]);

    return { scale, pressIn, pressOut };
}

const FONT = Platform.select({
    ios: "System",
    android: "Roboto",
    default: "System",
});

const styles = StyleSheet.create({
    progressRow: { flexDirection: "row", gap: 10, justifyContent: "center", marginBottom: 14 },
    dot: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
    dotActive: { backgroundColor: THEME.primary },
    dotIdle: { backgroundColor: THEME.primaryLight },
    dotText: { fontWeight: "900", fontFamily: FONT },
    dotTextActive: { color: THEME.card },
    dotTextIdle: { color: THEME.textMain },

    hTitle: { fontSize: 26, fontWeight: "900", color: THEME.textMain, fontFamily: FONT },
    hSub: { marginTop: 6, fontSize: 14, color: THEME.textSub, lineHeight: 20, fontFamily: FONT },

    section: { marginTop: 18, marginBottom: 10, fontSize: 14, fontWeight: "800", color: THEME.textMain, fontFamily: FONT },

    pill: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1 },
    pillOn: { backgroundColor: THEME.primary, borderColor: THEME.primary },
    pillOff: { backgroundColor: THEME.card, borderColor: THEME.border },
    pillText: { fontWeight: "800", fontFamily: FONT },
    pillTextOn: { color: THEME.card },
    pillTextOff: { color: THEME.textMain },

    checkRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 10 },
    checkBox: { width: 18, height: 18, borderRadius: 6, borderWidth: 2, borderColor: THEME.border },
    checkBoxOn: { backgroundColor: THEME.primary, borderColor: THEME.primary },
    checkLabel: { flex: 1, fontSize: 15, color: THEME.textMain, fontFamily: FONT },

    toggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },

    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        paddingTop: 12,
        paddingBottom: 6,
    },
    footerBtnGhost: {
        flex: 1,
        backgroundColor: THEME.card,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: THEME.border,
    },
    footerGhostText: { fontWeight: "800", color: THEME.textMain, fontFamily: FONT },

    footerBtn: { flex: 1, borderRadius: 16, paddingVertical: 14, alignItems: "center" },
    footerBtnPrimary: { backgroundColor: THEME.primary },
    footerBtnSuccess: {
        backgroundColor: "transparent",
        borderWidth: 0,
        overflow: "hidden",
    },
    successGradient: { ...StyleSheet.absoluteFillObject },
    footerBtnText: { color: THEME.card, fontWeight: "900", fontFamily: FONT },
    pressed: { opacity: 0.92 },
});

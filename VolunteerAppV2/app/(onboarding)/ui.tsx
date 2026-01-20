// app/(onboarding)/ui.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable, Switch } from "react-native";

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
    return (
        <Pressable onPress={onPress} style={[styles.pill, selected ? styles.pillOn : styles.pillOff]}>
            <Text style={[styles.pillText, selected ? styles.pillTextOn : styles.pillTextOff]}>{label}</Text>
        </Pressable>
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
    return (
        <Pressable onPress={() => onChange(!value)} style={styles.checkRow}>
            <View style={[styles.checkBox, value && styles.checkBoxOn]} />
            <Text style={styles.checkLabel}>{label}</Text>
        </Pressable>
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
    return (
        <View style={styles.footer}>
            {onBack ? (
                <Pressable style={styles.footerBtnGhost} onPress={onBack}>
                    <Text style={styles.footerGhostText}>{backLabel}</Text>
                </Pressable>
            ) : (
                <View style={{ width: 90 }} />
            )}

            <Pressable
                style={[styles.footerBtn, nextVariant === "success" ? styles.footerBtnSuccess : styles.footerBtnPrimary]}
                onPress={onNext}
            >
                <Text style={styles.footerBtnText}>{nextLabel}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    progressRow: { flexDirection: "row", gap: 10, justifyContent: "center", marginBottom: 14 },
    dot: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
    dotActive: { backgroundColor: "#1E3A8A" },
    dotIdle: { backgroundColor: "#E2E8F0" },
    dotText: { fontWeight: "900" },
    dotTextActive: { color: "#FFF" },
    dotTextIdle: { color: "#334155" },

    hTitle: { fontSize: 26, fontWeight: "900", color: "#0F172A" },
    hSub: { marginTop: 6, fontSize: 14, color: "#64748B", lineHeight: 20 },

    section: { marginTop: 18, marginBottom: 10, fontSize: 14, fontWeight: "800", color: "#334155" },

    pill: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1 },
    pillOn: { backgroundColor: "#1E3A8A", borderColor: "#1E3A8A" },
    pillOff: { backgroundColor: "#FFF", borderColor: "#E5E7EB" },
    pillText: { fontWeight: "800" },
    pillTextOn: { color: "#FFF" },
    pillTextOff: { color: "#0F172A" },

    checkRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 10 },
    checkBox: { width: 18, height: 18, borderRadius: 6, borderWidth: 2, borderColor: "#CBD5E1" },
    checkBoxOn: { backgroundColor: "#1E3A8A", borderColor: "#1E3A8A" },
    checkLabel: { flex: 1, fontSize: 15, color: "#0F172A" },

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
        backgroundColor: "#FFF",
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    footerGhostText: { fontWeight: "800", color: "#0F172A" },

    footerBtn: { flex: 1, borderRadius: 16, paddingVertical: 14, alignItems: "center" },
    footerBtnPrimary: { backgroundColor: "#1E3A8A" },
    footerBtnSuccess: { backgroundColor: "#16A34A" },
    footerBtnText: { color: "#FFF", fontWeight: "900" },
});

// app/(onboarding)/interests.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, TextInput, StyleSheet } from "react-native";
import { OnboardingContext } from "./_layout";
import { ProgressDots, ScreenHeader, SectionTitle, CheckboxRow, FooterNav } from "./ui";

const EVENTS = [
    "Amazing Season of Hope – Dec 21, 2025",
    "MLK Day Celebration Parade – Jan 17, 2026",
    "Annual Car Show & Music – Mar 29, 2026",
    "Back to School Bash – Jul 11, 2026",
    "Gala / Fashion Show – Oct 17, 2026",
    "Other",
];

const ROLES = [
    "Setup",
    "Registration",
    "Greeter",
    "Parking Attendant",
    "Decorating",
    "Assembly of bags/backpacks",
    "Organizing",
    "Food Server",
    "Stage / Lighting",
    "Clean up",
    "Other",
];

export default function Interests() {
    const router = useRouter();
    const ctx = React.useContext(OnboardingContext);
    if (!ctx) return null;
    const { draft, setDraft } = ctx;

    const toggleIn = (key: "events" | "roles", value: string) => {
        setDraft((d) => {
            const arr = new Set(d[key] ?? []);
            if (arr.has(value)) arr.delete(value);
            else arr.add(value);
            return { ...d, [key]: Array.from(arr) };
        });
    };

    return (
        <SafeAreaView style={styles.screen}>
            <ProgressDots current={2} />

            <ScrollView contentContainerStyle={styles.card} showsVerticalScrollIndicator={false}>
                <ScreenHeader title="Interests" subtitle="Help us match you with the right opportunities." />

                <SectionTitle>Why do you want to volunteer?</SectionTitle>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Tell us what motivates you…"
                    multiline
                    value={draft.motivation ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, motivation: t }))}
                />

                <SectionTitle>Which events interest you?</SectionTitle>
                {EVENTS.map((e) => (
                    <CheckboxRow
                        key={e}
                        label={e}
                        value={!!draft.events?.includes(e)}
                        onChange={() => toggleIn("events", e)}
                    />
                ))}

                <SectionTitle>How many hours are you available?</SectionTitle>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., 10–15 hours per month"
                    value={draft.hoursAvailable ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, hoursAvailable: t }))}
                />

                <SectionTitle>Community service hours?</SectionTitle>
                <CheckboxRow
                    label="Yes"
                    value={draft.communityService === "Yes"}
                    onChange={() => setDraft((d) => ({ ...d, communityService: "Yes" }))}
                />
                <CheckboxRow
                    label="No"
                    value={draft.communityService === "No"}
                    onChange={() => setDraft((d) => ({ ...d, communityService: "No" }))}
                />

                <SectionTitle>Volunteer assignment interests</SectionTitle>
                {ROLES.map((r) => (
                    <CheckboxRow
                        key={r}
                        label={r}
                        value={!!draft.roles?.includes(r)}
                        onChange={() => toggleIn("roles", r)}
                    />
                ))}

                <SectionTitle>Tasks you prefer to avoid (optional)</SectionTitle>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Anything you'd rather not do?"
                    multiline
                    value={draft.avoidTasks ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, avoidTasks: t }))}
                />

                <SectionTitle>Strengths you'd like to use (optional)</SectionTitle>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Skills, strengths, or roles you enjoy…"
                    multiline
                    value={draft.strengths ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, strengths: t }))}
                />

                <SectionTitle>Certifications / special training (optional)</SectionTitle>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="First aid, CPR, etc."
                    multiline
                    value={draft.certifications ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, certifications: t }))}
                />

                <FooterNav
                    onBack={() => router.back()}
                    onNext={() => router.push("/(onboarding)/availability")}
                    nextLabel="Continue"
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F4F6FB", padding: 16 },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 3,
    },
    input: {
        marginTop: 10,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 15,
    },
    textArea: { minHeight: 110, textAlignVertical: "top" },
});

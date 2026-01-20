// app/(onboarding)/availability.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, TextInput, StyleSheet, View } from "react-native";
import { OnboardingContext } from "./_layout";
import { ProgressDots, ScreenHeader, SectionTitle, CheckboxRow, PillChoice, FooterNav } from "./ui";

const TIMES = ["Morning (8–12)", "Afternoon (12–4)", "Evening (4–8)"];
const DAYS = ["Fridays", "Saturdays", "Sundays"];
const COMFORT = ["Children", "Seniors", "General public", "Animals", "Prefer not to say"];

export default function Availability() {
    const router = useRouter();
    const ctx = React.useContext(OnboardingContext);
    if (!ctx) return null;
    const { draft, setDraft } = ctx;

    const toggleList = (key: "timeOfDay" | "days" | "comfort", value: string) => {
        setDraft((d) => {
            const arr = new Set(d[key] ?? []);
            if (arr.has(value)) arr.delete(value);
            else arr.add(value);
            return { ...d, [key]: Array.from(arr) };
        });
    };

    return (
        <SafeAreaView style={styles.screen}>
            <ProgressDots current={3} />

            <ScrollView contentContainerStyle={styles.card} showsVerticalScrollIndicator={false}>
                <ScreenHeader title="Availability" subtitle="When and where do you prefer to volunteer?" />

                <SectionTitle>Time of day (select all)</SectionTitle>
                {TIMES.map((t) => (
                    <CheckboxRow key={t} label={t} value={!!draft.timeOfDay?.includes(t)} onChange={() => toggleList("timeOfDay", t)} />
                ))}

                <SectionTitle>Days (select all)</SectionTitle>
                {DAYS.map((d0) => (
                    <CheckboxRow key={d0} label={d0} value={!!draft.days?.includes(d0)} onChange={() => toggleList("days", d0)} />
                ))}

                <SectionTitle>Assignment preference</SectionTitle>
                <View style={styles.pills}>
                    {[
                        { k: "Indoor", label: "Indoor" },
                        { k: "Outdoor", label: "Outdoor" },
                        { k: "NoPreference", label: "No preference" },
                    ].map((p) => (
                        <PillChoice
                            key={p.k}
                            label={p.label}
                            selected={(draft.assignmentPreference ?? "NoPreference") === (p.k as any)}
                            onPress={() => setDraft((d) => ({ ...d, assignmentPreference: p.k as any }))}
                        />
                    ))}
                </View>

                <SectionTitle>Comfort level (select all)</SectionTitle>
                {COMFORT.map((c) => (
                    <CheckboxRow key={c} label={c} value={!!draft.comfort?.includes(c)} onChange={() => toggleList("comfort", c)} />
                ))}

                <SectionTitle>Accommodations (optional)</SectionTitle>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="e.g., wheelchair access, dietary restrictions…"
                    multiline
                    value={draft.accommodations ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, accommodations: t }))}
                />

                <FooterNav onBack={() => router.back()} onNext={() => router.push("/(onboarding)/signature-review")} />
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
    pills: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8 },
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

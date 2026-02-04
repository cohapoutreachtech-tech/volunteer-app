// app/(onboarding)/availability.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, View, Platform, TextInput } from "react-native";
import { OnboardingContext } from "./_layout";
import { ProgressDots, ScreenHeader, SectionTitle, CheckboxRow, PillChoice, FooterNav } from "./ui";
import { THEME } from "./theme";
import { ONBOARDING_SPACING } from "./layout";

const TIMES = ["Morning (8am-12pm)", "Afternoon (12pm-4pm)", "Evening (4pm-8pm)"];
const DAYS = ["Weekdays","Fridays", "Saturdays", "Sundays"];
const COMFORT = ["Children", "Seniors", "General Public", "Animals", "Prefer Not To Say"];

const FONT = Platform.select({ ios: "System", android: "Roboto", default: "System" });

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
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <ProgressDots current={3} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <ScreenHeader title="Availability" subtitle="When And Where Do You Prefer To Volunteer?" />

                <SectionTitle>Time Of Day (Select All)</SectionTitle>
                {TIMES.map((t) => (
                    <CheckboxRow key={t} label={t} value={!!draft.timeOfDay?.includes(t)} onChange={() => toggleList("timeOfDay", t)} />
                ))}

                <SectionTitle>Days (Select All)</SectionTitle>
                {DAYS.map((d0) => (
                    <CheckboxRow key={d0} label={d0} value={!!draft.days?.includes(d0)} onChange={() => toggleList("days", d0)} />
                ))}

                <SectionTitle>Assignment Preference</SectionTitle>
                <View style={styles.pills}>
                    {[
                        { k: "Indoor", label: "Indoor" },
                        { k: "Outdoor", label: "Outdoor" },
                        { k: "NoPreference", label: "No Preference" },
                    ].map((p) => (
                        <PillChoice
                            key={p.k}
                            label={p.label}
                            selected={(draft.assignmentPreference ?? "NoPreference") === (p.k as any)}
                            onPress={() => setDraft((d) => ({ ...d, assignmentPreference: p.k as any }))}
                        />
                    ))}
                </View>

                <SectionTitle>Comfort Level (Select All)</SectionTitle>
                {COMFORT.map((c) => (
                    <CheckboxRow key={c} label={c} value={!!draft.comfort?.includes(c)} onChange={() => toggleList("comfort", c)} />
                ))}

                <SectionTitle>Accommodations (Optional)</SectionTitle>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="E.g., Wheelchair Access, Dietary Restrictions…"
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
    screen: { flex: 1, backgroundColor: THEME.bg, padding: ONBOARDING_SPACING.outerPadding },
    content: {
        paddingTop: ONBOARDING_SPACING.contentPaddingTop,
        paddingBottom: ONBOARDING_SPACING.contentPaddingBottom,
        paddingHorizontal: ONBOARDING_SPACING.contentPaddingHorizontal,
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
        fontFamily: FONT,
    },
    textArea: { minHeight: 110, textAlignVertical: "top" },
});

// app/(onboarding)/interests.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TextInput, StyleSheet, Platform, View, Text } from "react-native";
import { OnboardingContext } from "./_layout";
import { ProgressDots, ScreenHeader, SectionTitle, CheckboxRow, FooterNav } from "./ui";
import { THEME } from "./theme";
import { ONBOARDING_SPACING } from "./layout";

const EVENTS = [
    "Amazing Season Of Hope – Dec 21, 2025",
    "MLK Day Celebration Parade – Jan 17, 2026",
    "Annual Car Show & Music – Mar 29, 2026",
    "Back To School Bash – Jul 11, 2026",
    "Gala / Fashion Show – Oct 17, 2026",
    "Other",
];

const VOLUNTEER_ASSIGNMENT_OPTIONS = [
    { value: "Setup", description: "Arrange Furniture, Equipment, And Event Space" },
    { value: "Registration", description: "Check-In Attendees And Manage Sign-Ups" },
    { value: "Greeter", description: "Welcome Guests And Provide Directions" },
    { value: "Parking Attendant", description: "Direct Traffic And Assist With Parking" },
    { value: "Decorating", description: "Create Visual Displays And Festive Atmosphere" },
    { value: "Assembly of Hygiene Kits / Backpacks", description: "Pack And Organize Giveaway Items" },
    { value: "Organizing", description: "Coordinate Supplies And Manage Logistics" },
    { value: "Food Server", description: "Distribute Meals And Refreshments" },
    { value: "Stage / Lighting", description: "Operate Technical Equipment For Presentations" },
    { value: "Clean Up / Take Down", description: "Break Down And Restore Venue After Event" },
    { value: "Other", description: "" },
] as const;

const FONT = Platform.select({ ios: "System", android: "Roboto", default: "System" });

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
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <ProgressDots current={2} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <ScreenHeader title="Volunteer Interests" subtitle="Help Us Match You With The Right Opportunities" />

                <SectionTitle>Why do you want to volunteer for COHAP Outreach Corporation?</SectionTitle>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Tell Us What Motivates You…"
                    multiline
                    value={draft.motivation ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, motivation: t }))}
                />

                <SectionTitle>Which event(s) do you want to volunteer for?</SectionTitle>
                {EVENTS.map((e) => (
                    <CheckboxRow
                        key={e}
                        label={e}
                        value={!!draft.events?.includes(e)}
                        onChange={() => toggleIn("events", e)}
                    />
                ))}

                <SectionTitle>How many hours are you available in total?</SectionTitle>
                <TextInput
                    style={styles.input}
                    placeholder="E.g., 10–15 Hours Per Month"
                    value={draft.hoursAvailable ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, hoursAvailable: t }))}
                />

                <SectionTitle>Are you volunteering to earn community service hours?</SectionTitle>
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

                <SectionTitle>Volunteer Assignment Interests</SectionTitle>
                {VOLUNTEER_ASSIGNMENT_OPTIONS.map((opt) => (
                    <View key={opt.value} style={styles.assignmentRow}>
                        <CheckboxRow
                            label={opt.value}
                            value={!!draft.roles?.includes(opt.value)}
                            onChange={() => toggleIn("roles", opt.value)}
                        />
                        {!!opt.description && <Text style={styles.assignmentDesc}>{opt.description}</Text>}
                    </View>
                ))}

                <SectionTitle>Are there any tasks you prefer to avoid?</SectionTitle>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Anything You&apos;d Rather Not Do?"
                    multiline
                    value={draft.avoidTasks ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, avoidTasks: t }))}
                />

                <SectionTitle>What skills or strengths would you like to use while volunteering?</SectionTitle>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Skills, Strengths, Or Roles You Enjoy…"
                    multiline
                    value={draft.strengths ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, strengths: t }))}
                />

                <SectionTitle>List relevant certifications or special training</SectionTitle>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="First Aid, CPR, Etc."
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
    screen: { flex: 1, backgroundColor: THEME.bg, padding: ONBOARDING_SPACING.outerPadding },
    content: {
        paddingTop: ONBOARDING_SPACING.contentPaddingTop,
        paddingBottom: ONBOARDING_SPACING.contentPaddingBottom,
        paddingHorizontal: ONBOARDING_SPACING.contentPaddingHorizontal,
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
        fontFamily: FONT,
    },
    textArea: { minHeight: 110, textAlignVertical: "top" },
    assignmentRow: { paddingVertical: 6 },
    assignmentDesc: {
        marginTop: 4,
        marginLeft: 28,
        color: THEME.textSub,
        fontSize: 13,
        lineHeight: 18,
        fontFamily: FONT,
    },
});

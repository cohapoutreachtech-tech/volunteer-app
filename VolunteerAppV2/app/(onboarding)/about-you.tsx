// app/(onboarding)/about-you.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView, StyleSheet, Platform, TextInput } from "react-native";
import { OnboardingContext } from "./_layout";
import { ProgressDots, ScreenHeader, SectionTitle, PillChoice, ToggleRow, FooterNav } from "./ui";
import { THEME } from "./theme";
import { ONBOARDING_SPACING } from "./layout";

const FONT = Platform.select({ ios: "System", android: "Roboto", default: "System" });

export default function AboutYou() {
    const router = useRouter();
    const ctx = React.useContext(OnboardingContext);
    if (!ctx) return null;

    const { draft, setDraft } = ctx;

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <ProgressDots current={1} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <ScreenHeader title="About You" subtitle="Basic Details To Get You Registered" />

                <SectionTitle>Personal details</SectionTitle>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="First Name"
                        value={draft.firstName ?? ""}
                        onChangeText={(t) => setDraft((d) => ({ ...d, firstName: t }))}
                    />
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Last Name"
                        value={draft.lastName ?? ""}
                        onChangeText={(t) => setDraft((d) => ({ ...d, lastName: t }))}
                    />
                </View>

                <SectionTitle>Volunteering as</SectionTitle>
                <View style={styles.pills}>
                    <PillChoice
                        label="Individual"
                        selected={(draft.volunteerAs ?? "Individual") === "Individual"}
                        onPress={() => setDraft((d) => ({ ...d, volunteerAs: "Individual" }))}
                    />
                    <PillChoice
                        label="Company/Organization"
                        selected={draft.volunteerAs === "Company/Organization"}
                        onPress={() => setDraft((d) => ({ ...d, volunteerAs: "Company/Organization" }))}
                    />
                </View>

                <SectionTitle>Contact</SectionTitle>

                <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    keyboardType="phone-pad"
                    value={draft.phone ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, phone: t }))}
                />

                <SectionTitle>Date of birth</SectionTitle>
                <TextInput
                    style={styles.input}
                    placeholder="MM / DD / YYYY"
                    value={draft.dob ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, dob: t }))}
                />

                <SectionTitle>T-shirt size</SectionTitle>
                <View style={styles.pills}>
                    {["XS", "S", "M", "L", "XL", "2XL", "3XL","4XL","5XL"].map((s) => (
                        <PillChoice
                            key={s}
                            label={s}
                            selected={draft.tshirtSize === s}
                            onPress={() => setDraft((d) => ({ ...d, tshirtSize: s }))}
                        />
                    ))}
                </View>

                <SectionTitle>Social Media (optional)</SectionTitle>
                <TextInput
                    style={styles.input}
                    placeholder="Facebook Handle"
                    value={draft.facebook ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, facebook: t }))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Instagram Handle"
                    value={draft.instagram ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, instagram: t }))}
                />

                <SectionTitle>Notifications</SectionTitle>
                <ToggleRow
                    label="Text Me Updates and Opportunities"
                    value={!!draft.textOptIn}
                    onChange={(v) => setDraft((d) => ({ ...d, textOptIn: v }))}
                />

                <FooterNav
                    onBack={() => router.back()}
                    onNext={() => router.push("/(onboarding)/interests")}
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
    row: { flexDirection: "row", gap: 10 },
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
    pills: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8 },
});

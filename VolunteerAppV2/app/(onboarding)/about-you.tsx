// app/(onboarding)/about-you.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView, View, ScrollView, Text, TextInput, StyleSheet } from "react-native";
import { OnboardingContext } from "./_layout";
import { ProgressDots, ScreenHeader, SectionTitle, PillChoice, ToggleRow, FooterNav } from "./ui";

export default function AboutYou() {
    const router = useRouter();
    const ctx = React.useContext(OnboardingContext);
    if (!ctx) return null;

    const { draft, setDraft } = ctx;

    return (
        <SafeAreaView style={styles.screen}>
            <ProgressDots current={1} />

            <ScrollView contentContainerStyle={styles.card} showsVerticalScrollIndicator={false}>
                <ScreenHeader title="About you" subtitle="Basic details to get you registered." />

                <SectionTitle>Personal details</SectionTitle>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="First name"
                        value={draft.firstName ?? ""}
                        onChangeText={(t) => setDraft((d) => ({ ...d, firstName: t }))}
                    />
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Last name"
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
                        label="Company rep"
                        selected={draft.volunteerAs === "CompanyRep"}
                        onPress={() => setDraft((d) => ({ ...d, volunteerAs: "CompanyRep" }))}
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
                    {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map((s) => (
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
                    placeholder="Facebook handle"
                    value={draft.facebook ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, facebook: t }))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Instagram handle"
                    value={draft.instagram ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, instagram: t }))}
                />

                <SectionTitle>Notifications</SectionTitle>
                <ToggleRow
                    label="Text me updates and opportunities"
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
    },
    pills: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8 },
});

// app/(onboarding)/signature-review.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, View, Text, TextInput, StyleSheet } from "react-native";
import { OnboardingContext } from "./_layout";
import { ProgressDots, ScreenHeader, SectionTitle, CheckboxRow, FooterNav } from "./ui";

export default function SignatureReview() {
    const router = useRouter();
    const ctx = React.useContext(OnboardingContext);
    if (!ctx) return null;
    const { draft, setDraft, reset } = ctx;

    const fullName = `${draft.firstName ?? ""} ${draft.lastName ?? ""}`.trim() || "—";
    const eventCount = draft.events?.length ?? 0;

    return (
        <SafeAreaView style={styles.screen}>
            <ProgressDots current={4} />

            <ScrollView contentContainerStyle={styles.card} showsVerticalScrollIndicator={false}>
                <ScreenHeader title="Signature & review" subtitle="Confirm your information before submitting." />

                <View style={styles.noticeBox}>
                    <Text style={styles.noticeText}>
                        I confirm the information in this registration is true and complete. I understand false information may result in termination of volunteer status.
                    </Text>
                </View>

                <SectionTitle>Attestation</SectionTitle>
                <CheckboxRow
                    label="I affirm I am not a registered offender and have read the statement above."
                    value={!!draft.attested}
                    onChange={(v) => setDraft((d) => ({ ...d, attested: v }))}
                />

                <SectionTitle>Electronic signature</SectionTitle>
                <TextInput
                    style={styles.input}
                    placeholder="Type your full name"
                    value={draft.signature ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, signature: t }))}
                />

                <Text style={styles.dateText}>Date: {new Date().toLocaleDateString()}</Text>

                <SectionTitle>Review your info</SectionTitle>
                <View style={styles.reviewCard}>
                    <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Name</Text>
                        <Text style={styles.reviewValue}>{fullName}</Text>
                    </View>
                    <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Email</Text>
                        <Text style={styles.reviewValue}>{draft.email ?? "—"}</Text>
                    </View>
                    <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Phone</Text>
                        <Text style={styles.reviewValue}>{draft.phone ?? "—"}</Text>
                    </View>
                    <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Events</Text>
                        <Text style={styles.reviewValue}>{eventCount} selected</Text>
                    </View>
                </View>

                <SectionTitle>Comments (optional)</SectionTitle>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Anything you'd like to share?"
                    multiline
                    value={draft.comments ?? ""}
                    onChangeText={(t) => setDraft((d) => ({ ...d, comments: t }))}
                />

                <FooterNav
                    onBack={() => router.back()}
                    onNext={() => {
                        // Prototype submit: reset and show success screen
                        router.push("/(onboarding)/registration-complete");
                    }}
                    nextLabel="Submit registration"
                    nextVariant="success"
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
    noticeBox: { backgroundColor: "#FFF7ED", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "#FED7AA" },
    noticeText: { color: "#7C2D12", fontSize: 14, lineHeight: 20, fontWeight: "600" },

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
    dateText: { marginTop: 10, color: "#64748B", fontWeight: "700" },

    reviewCard: { marginTop: 8, backgroundColor: "#F8FAFC", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "#E5E7EB" },
    reviewRow: { paddingVertical: 8 },
    reviewLabel: { fontSize: 12, color: "#64748B", fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.6 },
    reviewValue: { marginTop: 4, fontSize: 15, color: "#0F172A", fontWeight: "700" },
});

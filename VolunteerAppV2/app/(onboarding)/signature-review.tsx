// app/(onboarding)/signature-review.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, TextInput, StyleSheet, Platform, Animated } from "react-native";
import { OnboardingContext } from "./_layout";
import { ProgressDots, ScreenHeader, SectionTitle, CheckboxRow, FooterNav } from "./ui";
import { THEME } from "./theme";
import { ONBOARDING_SPACING } from "./layout";

const FONT = Platform.select({ ios: "System", android: "Roboto", default: "System" });

export default function SignatureReview() {
    const router = useRouter();
    const ctx = React.useContext(OnboardingContext);

    const appear = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
        Animated.timing(appear, {
            toValue: 1,
            duration: 380,
            useNativeDriver: true,
        }).start();
    }, [appear]);

    if (!ctx) return null;
    const { draft, setDraft } = ctx;

    const fullName = `${draft.firstName ?? ""} ${draft.lastName ?? ""}`.trim() || "—";
    const eventCount = draft.events?.length ?? 0;

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <Animated.View
                style={{
                    flex: 1,
                    opacity: appear,
                    transform: [
                        {
                            translateY: appear.interpolate({
                                inputRange: [0, 1],
                                outputRange: [10, 0],
                            }),
                        },
                    ],
                }}
            >
                <ProgressDots current={4} />

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <ScreenHeader title="Signature & Review" subtitle="Confirm Your Information Before Submitting." />

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

                    <SectionTitle>Electronic Signature</SectionTitle>
                    <TextInput
                        style={styles.input}
                        placeholder="Type Your Full Name"
                        value={draft.signature ?? ""}
                        onChangeText={(t) => setDraft((d) => ({ ...d, signature: t }))}
                    />

                    <Text style={styles.dateText}>Date: {new Date().toLocaleDateString()}</Text>

                    <SectionTitle>Review Your Info</SectionTitle>
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
                            <Text style={styles.reviewValue}>{eventCount} Selected</Text>
                        </View>
                    </View>

                    <SectionTitle>Comments (Optional)</SectionTitle>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Anything You'd Like To Share?"
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
                        nextLabel="Submit Registration"
                        nextVariant="success"
                    />
                </ScrollView>
            </Animated.View>
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
    noticeBox: { backgroundColor: "#FFF7ED", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "#FED7AA" },
    noticeText: { color: "#7C2D12", fontSize: 14, lineHeight: 20, fontWeight: "600", fontFamily: FONT },

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
    dateText: { marginTop: 10, color: "#64748B", fontWeight: "700", fontFamily: FONT },

    reviewCard: { marginTop: 8, backgroundColor: "#F8FAFC", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "#E5E7EB" },
    reviewRow: { paddingVertical: 8 },
    reviewLabel: { fontSize: 12, color: "#64748B", fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.6, fontFamily: FONT },
    reviewValue: { marginTop: 4, fontSize: 15, color: "#0F172A", fontWeight: "700", fontFamily: FONT },
});

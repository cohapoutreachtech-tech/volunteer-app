// app/(onboarding)/create-account.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, StyleSheet, Pressable, Platform, ScrollView, KeyboardAvoidingView } from "react-native";
import { ScreenHeader, SectionTitle, FooterNav } from "./ui";
import { THEME } from "./theme";
import { ONBOARDING_SPACING } from "./layout";

const FONT = Platform.select({ ios: "System", android: "Roboto", default: "System" });

export default function CreateAccount() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <ScreenHeader title="Create Your Account" />

                    <SectionTitle>Account Details</SectionTitle>

                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} placeholder="name@email.com" keyboardType="email-address" />

                    <Text style={styles.label}>Password</Text>
                    <TextInput style={styles.input} placeholder="••••••••" secureTextEntry />

                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput style={styles.input} placeholder="••••••••" secureTextEntry />

                    <Pressable style={styles.linkBtn} onPress={() => router.replace("/(onboarding)")}>
                        <Text style={styles.linkText}>Already Have An Account? Sign In</Text>
                    </Pressable>

                    <FooterNav
                        onBack={() => router.back()}
                        onNext={() => router.push("/(onboarding)/about-you")}
                        nextLabel="Start Registration"
                    />
                </ScrollView>
            </KeyboardAvoidingView>
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
    label: { fontSize: 13, fontWeight: "700", color: THEME.textMain, marginTop: 12, marginBottom: 6, fontFamily: FONT },
    input: {
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 15,
    },
    linkBtn: { marginTop: 10, paddingVertical: 10 },
    linkText: { color: THEME.primary, fontWeight: "800", fontFamily: FONT },
});

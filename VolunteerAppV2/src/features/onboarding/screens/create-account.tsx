import React, { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, StyleSheet, Pressable, Platform, ScrollView, KeyboardAvoidingView, ActivityIndicator } from "react-native";
import { ScreenHeader, SectionTitle, FooterNav } from "@features/onboarding/components/ui";
import { THEME } from "@features/onboarding/theme";
import { ONBOARDING_SPACING } from "@features/onboarding/layout";
import { useLoginMutation } from "@features/auth/hooks/useLoginMutation";

const FONT = Platform.select({ ios: "System", android: "Roboto", default: "System" });

export default function CreateAccount() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const loginMutation = useLoginMutation();

    const handleRegister = async () => {
        console.log('[CreateAccount] handleRegister called', { email });
        setError(null);
        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            console.log('[CreateAccount] calling mutateAsync');
            await loginMutation.mutateAsync({ email, password });
            console.log('[CreateAccount] login mutation succeeded');
            router.replace("/(tabs)"); // Go to protected area on success
        } catch (err: any) {
            console.log('[CreateAccount] login mutation failed', err);
            setError(err?.message || "Registration failed");
        }
    };

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
                    <TextInput style={styles.input} placeholder="name@email.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

                    <Text style={styles.label}>Password</Text>
                    <TextInput style={styles.input} placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />

                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput style={styles.input} placeholder="••••••••" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

                    {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
                    {loginMutation.isPending && <ActivityIndicator style={{ marginTop: 8 }} />}

                    <Pressable style={styles.linkBtn} onPress={() => router.replace("/(onboarding)")}>
                        <Text style={styles.linkText}>Already Have An Account? Sign In</Text>
                    </Pressable>

                    <FooterNav
                        onBack={() => router.back()}
                        onNext={handleRegister}
                        nextLabel="Start Registration"
                    />

                    {__DEV__ && (
                        <Pressable
                            style={[styles.linkBtn, { backgroundColor: '#eee', borderRadius: 8, padding: 10, marginTop: 12 }]}
                            onPress={() => {
                                console.log('[CreateAccount] DEBUG test button pressed');
                                void handleRegister();
                            }}
                        >
                            <Text style={{ textAlign: 'center' }}>DEBUG: Test Register</Text>
                        </Pressable>
                    )}
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

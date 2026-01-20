// app/(onboarding)/create-account.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { ScreenHeader, SectionTitle, FooterNav } from "./ui";

export default function CreateAccount() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <View style={styles.card}>
                <ScreenHeader
                    title="Create your account"
                />

                <SectionTitle>Account details</SectionTitle>

                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} placeholder="name@email.com" keyboardType="email-address" />

                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} placeholder="••••••••" secureTextEntry />

                <Text style={styles.label}>Confirm password</Text>
                <TextInput style={styles.input} placeholder="••••••••" secureTextEntry />

                <Pressable style={styles.linkBtn} onPress={() => router.replace("/(onboarding)")}>
                    <Text style={styles.linkText}>Already have an account? Sign in</Text>
                </Pressable>

                <FooterNav
                    onBack={() => router.back()}
                    onNext={() => router.push("/(onboarding)/about-you")}
                    nextLabel="Start registration"
                />
            </View>
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
    label: { fontSize: 13, fontWeight: "700", color: "#334155", marginTop: 12, marginBottom: 6 },
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
    linkText: { color: "#1E3A8A", fontWeight: "800" },
});

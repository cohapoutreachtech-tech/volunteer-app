// app/(onboarding)/registration-complete.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView, View, Text, StyleSheet, Pressable } from "react-native";
import { OnboardingContext } from "./_layout";

export default function RegistrationComplete() {
    const router = useRouter();
    const ctx = React.useContext(OnboardingContext);

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.card}>
                <Text style={styles.title}>Registration submitted</Text>


                <Pressable
                    style={styles.primary}
                    onPress={() => {
                        ctx?.reset();
                        router.replace("/(tabs)");
                    }}
                >
                    <Text style={styles.primaryText}>Continue to dashboard</Text>
                </Pressable>

                <Pressable style={styles.secondary} onPress={() => router.replace("/(onboarding)")}>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F4F6FB", padding: 16, justifyContent: "center" },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 18,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 3,
    },
    title: { fontSize: 26, fontWeight: "900", color: "#0F172A" },
    subtitle: { marginTop: 10, fontSize: 15, color: "#64748B", lineHeight: 22 },
    primary: { marginTop: 18, backgroundColor: "#16A34A", paddingVertical: 14, borderRadius: 16, alignItems: "center" },
    primaryText: { color: "#FFF", fontWeight: "900", fontSize: 16 },
    secondary: { marginTop: 10, paddingVertical: 12, borderRadius: 16, alignItems: "center" },
    secondaryText: { color: "#1E3A8A", fontWeight: "800" },
});

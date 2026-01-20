// app/(onboarding)/index.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView, View, Text, TextInput, StyleSheet, Pressable } from "react-native";

export default function Welcome() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.hero}>
                <Text style={styles.title}>COHAP Volunteers</Text>
                <Text style={styles.subtitle}>Sign in, or start your registration.</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} placeholder="name@email.com" />

                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} placeholder="••••••••" secureTextEntry />

                <Pressable style={styles.primary} onPress={() => router.replace("/(tabs)")}>
                    <Text style={styles.primaryText}>Sign In</Text>
                </Pressable>

                <Pressable style={styles.secondary} onPress={() => router.push("/(onboarding)/create-account")}>
                    <Text style={styles.secondaryText}>Create an account</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F4F6FB", padding: 16 },
    hero: { paddingVertical: 28, paddingHorizontal: 4 },
    title: { fontSize: 32, fontWeight: "800", color: "#0F172A" },
    subtitle: { marginTop: 8, fontSize: 15, color: "#64748B" },

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
    label: { fontSize: 13, fontWeight: "700", color: "#312e81", marginTop: 12, marginBottom: 6 },
    input: {
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 15,
    },
    primary: {
        marginTop: 16,
        backgroundColor: "#312e81",
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
    },
    primaryText: { color: "#FFF", fontWeight: "800", fontSize: 16 },
    secondary: { marginTop: 12, paddingVertical: 12, borderRadius: 16, alignItems: "center" },
    secondaryText: { color: "#312e81", fontWeight: "700" },
});

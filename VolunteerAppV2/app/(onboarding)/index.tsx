// app/(onboarding)/index.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, StyleSheet, Pressable, Platform, Image } from "react-native";
import { THEME } from "./theme";
import { ONBOARDING_SPACING } from "./layout";

const FONT = Platform.select({ ios: "System", android: "Roboto", default: "System" });

export default function Welcome() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <View style={styles.content}>
                <View style={styles.hero}>
                    <Image
                        source={require("../../assets/images/CohapLogo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                        accessibilityLabel="Cohap Logo"
                    />
                    <Text style={styles.title}>COHAP OUTREACH CORPORATION</Text>
                    <Text style={styles.subtitle}>Volunteer Portal</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} placeholder="name@email.com" placeholderTextColor={THEME.textSub} />

                    <Text style={styles.label}>Password</Text>
                    <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={THEME.textSub} secureTextEntry />

                    <Pressable style={styles.primary} onPress={() => router.replace("/(tabs)")}>
                        <Text style={styles.primaryText}>Sign In</Text>
                    </Pressable>

                    <Pressable style={styles.secondary} onPress={() => router.push("/(onboarding)/create-account")}>
                        <Text style={styles.secondaryText}>Create An Account</Text>
                    </Pressable>
                </View>
            </View>
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
    hero: { paddingTop: 20, paddingBottom: 18, alignItems: "center" },
    logo: { width: 125, height: 125, marginBottom: 14 },
    title: { fontSize: 24, fontWeight: "800", color: THEME.primary, fontFamily: FONT, textAlign: "center" },
    subtitle: { marginTop: 8, fontSize: 16, color: THEME.primary, fontFamily: FONT, textAlign: "center" },

    form: { marginTop: 18 },

    label: { fontSize: 13, fontWeight: "700", color: THEME.textMain, marginTop: 14, marginBottom: 8, fontFamily: FONT },
    input: {
        backgroundColor: THEME.card,
        borderWidth: 1,
        borderColor: THEME.border,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 16,
        fontFamily: FONT,
        color: THEME.textMain,
    },
    primary: {
        marginTop: 18,
        backgroundColor: THEME.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
    },
    primaryText: { color: "#FFF", fontWeight: "800", fontSize: 16, fontFamily: FONT },
    secondary: { marginTop: 12, paddingVertical: 12, borderRadius: 16, alignItems: "center" },
    secondaryText: { color: THEME.primary, fontWeight: "700", fontFamily: FONT },
});

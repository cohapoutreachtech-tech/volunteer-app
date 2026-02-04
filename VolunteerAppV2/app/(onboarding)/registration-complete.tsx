// app/(onboarding)/registration-complete.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Pressable, Platform, Image, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { OnboardingContext } from "./_layout";
import { THEME } from "./theme";
import { ONBOARDING_SPACING } from "./layout";

const FONT = Platform.select({ ios: "System", android: "Roboto", default: "System" });

export default function RegistrationComplete() {
    const router = useRouter();
    const ctx = React.useContext(OnboardingContext);
    const appear = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(appear, {
            toValue: 1,
            duration: 420,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [appear]);

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <Animated.View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    opacity: appear,
                    transform: [{ translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
                }}
            >
                <View style={styles.hero}>
                    <Image
                        source={require("../../assets/images/CohapLogo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                        accessibilityLabel="Cohap Logo"
                    />
                    <Text style={styles.title}>Welcome Aboard</Text>
                    <Text style={styles.subtitle}>
                        Your Registration Has Been Submitted. You Can Now Start Using The Volunteer Portal.
                    </Text>
                </View>

                <Pressable
                    style={({ pressed }) => [styles.primary, pressed && { opacity: 0.95 }]}
                    onPress={() => {
                        ctx?.reset();
                        router.replace("/(tabs)");
                    }}
                >
                    <LinearGradient
                        colors={["#11998e", "#38ef7d"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.successGradient}
                    />
                    <Text style={styles.primaryText}>Continue To Dashboard</Text>
                </Pressable>

                <Pressable style={styles.secondary} onPress={() => router.replace("/(onboarding)")}>
                </Pressable>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: THEME.bg, padding: ONBOARDING_SPACING.outerPadding },
    hero: { alignItems: "center", marginBottom: 26 },
    logo: { width: 135, height: 135, marginBottom: 14 },
    title: { fontSize: 28, fontWeight: "900", color: THEME.textMain, fontFamily: FONT, textAlign: "center" },
    subtitle: { marginTop: 10, fontSize: 15, color: THEME.textSub, lineHeight: 22, fontFamily: FONT, textAlign: "center" },

    primary: {
        marginTop: 10,
        backgroundColor: "transparent",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
        overflow: "hidden",
    },
    successGradient: { ...StyleSheet.absoluteFillObject },
    primaryText: { color: "#FFF", fontWeight: "900", fontSize: 16, fontFamily: FONT },

    secondary: { marginTop: 10, paddingVertical: 12, borderRadius: 16, alignItems: "center" },
    secondaryText: { color: THEME.primary, fontWeight: "800", fontFamily: FONT },
});

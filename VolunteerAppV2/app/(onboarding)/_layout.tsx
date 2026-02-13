// app/(onboarding)/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import {useEffect}  from "react";
import { login } from '../../src/repositories/volunteers/MockVolunteerRepository';

// No persistence, no storage, wiped on app reload.
export type OnboardingDraft = {
    // AboutYou
    firstName?: string;
    lastName?: string;
    volunteerAs?: "Individual" | "Company/Organization";
    email?: string;
    phone?: string;
    dob?: string;
    tshirtSize?: string;
    facebook?: string;
    instagram?: string;
    textOptIn?: boolean;

    // Interests
    motivation?: string;
    events?: string[];
    hoursAvailable?: string;
    communityService?: "Yes" | "No";
    roles?: string[];
    avoidTasks?: string;
    strengths?: string;
    certifications?: string;

    // Availability
    timeOfDay?: string[];
    days?: string[];
    assignmentPreference?: "Indoor" | "Outdoor" | "NoPreference";
    comfort?: string[];
    accommodations?: string;

    // Signature
    attested?: boolean;
    signature?: string;
    comments?: string;
};

type Ctx = {
    draft: OnboardingDraft;
    setDraft: React.Dispatch<React.SetStateAction<OnboardingDraft>>;
    reset: () => void;
};

export const OnboardingContext = React.createContext<Ctx | null>(null);

export default function OnboardingLayout() {
    const [draft, setDraft] = React.useState<OnboardingDraft>({
        events: [],
        roles: [],
        timeOfDay: [],
        days: [],
        comfort: [],
        textOptIn: false,
        attested: false,
    });

    const reset = React.useCallback(() => {
        setDraft({
            events: [],
            roles: [],
            timeOfDay: [],
            days: [],
            comfort: [],
            textOptIn: false,
            attested: false,
        });
    }, []);

    React.useEffect(() => {
        const run = async () => {
            try {
                const data = await login();
                console.log("Login successful:", data);
            }
            catch (e) {
                console.error("Login failed:", e);


            }
        }
        void run();

    }, []);


    return (
        <OnboardingContext.Provider value={{ draft, setDraft, reset }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </OnboardingContext.Provider>
    );
}

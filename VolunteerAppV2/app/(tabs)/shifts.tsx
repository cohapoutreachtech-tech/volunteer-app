import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useVolunteerHours } from '../../src/hooks/useVolunteerHours';
import ShiftsView from '../../src/views/ShiftsView';

const TEMP_VOLUNTEER_ID = '694f15697fa85a691e4c75a4';

function formatStartLabel(date: Date): string {
    return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });
}

export default function ShiftsScreen() {
    const { entries, isLoading, error, refetch } =
        useVolunteerHours(TEMP_VOLUNTEER_ID);

    // Timer state
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [startedAt, setStartedAt] = useState<Date | null>(null);

    // Timer loop
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    // Toggle timer
    const handlePrimaryPress = () => {
        setIsRunning((prev) => {
            const next = !prev;

            if (next) {
                setElapsedSeconds(0);
                setStartedAt(new Date());
            } else {
                setStartedAt(null);
            }

            return next;
        });
    };

    const pending = entries.filter((e) => e.approvalStatus === 'Pending');
    const approved = entries.filter((e) => e.approvalStatus === 'Approved');

    const startedLabel = useMemo(() => {
        if (!isRunning || !startedAt) return undefined;
        return `Shift started at ${formatStartLabel(startedAt)}`;
    }, [isRunning, startedAt]);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <Text>Loading shifts...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text>{error}</Text>
                <Text style={styles.retry} onPress={() => void refetch()}>
                    Tap to retry
                </Text>
            </View>
        );
    }

    return (
        <ShiftsView
            timer={{
                isRunning,
                elapsedSeconds,
                startedLabel,
            }}
            onPressPrimary={handlePrimaryPress}
            pending={pending}
            approved={approved}
        />
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retry: {
        marginTop: 10,
        textDecorationLine: 'underline',
    },
});

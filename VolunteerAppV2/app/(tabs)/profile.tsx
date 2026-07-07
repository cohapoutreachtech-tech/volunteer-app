import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSession } from '../../src/core/auth/sessionStore';
import { useVolunteer } from '../../src/features/profile/hooks/useVolunteer';
import ProfileView from '../../src/features/profile/screens/ProfileView';
import { useVolunteerHoursSummary } from '../../src/features/volunteerHours/hooks/useVolunteerHoursSummary';

export default function ProfileScreen() {
  const { volunteerId } = useSession();
  const { data: volunteer, isLoading, error, refetch } = useVolunteer(volunteerId ?? undefined);
    const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useVolunteerHoursSummary(volunteerId ?? undefined);


  if (isLoading || isSummaryLoading) {
    return (
        <View style={styles.center}>
          <Text>Loading profile...</Text>
        </View>
    );
  }

  if (!volunteer) {
    return (
        <View style={styles.center}>
          <Text>{error?.message ?? summaryError?.message ?? 'Profile not found'}</Text>
          <Text
              style={styles.retry}
              onPress={() => {
                void refetch();
                void refetchSummary();
              }}
          >
            Tap to retry
          </Text>
        </View>
    );
  }
  const mergedVolunteer = {
    ...volunteer,
    totalHoursWorked: summary?.approvedHours ?? volunteer.totalHoursWorked,
  };

  return <ProfileView volunteer={mergedVolunteer} />;


}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F4F6FB',
  },
  retry: {
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

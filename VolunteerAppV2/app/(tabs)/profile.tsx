import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useVolunteer } from '../../src/hooks/useVolunteer';
import ProfileView from '../../src/views/ProfileView';
import { useVolunteerHoursSummary } from '../../src/hooks/useVolunteerHoursSummary';

/**
 * Temporary: hardcoded volunteer id until auth is implemented.
 * This should be replaced later by "current user" logic.
 */
const TEMP_VOLUNTEER_ID = '694f15697fa85a691e4c75a4';

export default function ProfileScreen() {
  const { volunteer, isLoading, error, refetch } = useVolunteer(TEMP_VOLUNTEER_ID);
    const {
    summary,
    isLoading: isSummaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useVolunteerHoursSummary(TEMP_VOLUNTEER_ID);


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
          <Text>{error ?? summaryError ?? 'Profile not found'}</Text>
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

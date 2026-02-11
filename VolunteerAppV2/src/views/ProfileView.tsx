// src/views/ProfileView.tsx

import { Image, ScrollView, StyleSheet, View } from 'react-native';
import type { Volunteer } from '../models/Volunteer';
import ProfileHeaderCard from '../components/profile/ProfileHeaderCard';
import InfoRowCard from '../components/profile/InfoRowCard';
import { TAB_BAR_OVERLAY_HEIGHT } from '../components/navigation/CustomTabBar';

type Props = {
  volunteer: Volunteer;
};

/**
 * Pure presentation component:
 * - No hooks
 * - No repositories
 * - Just layout + formatting
 *
 * Depends on n
 */
export default function ProfileView({ volunteer }: Props) {
  const first = volunteer.firstName?.trim() ?? '';
  const last = volunteer.lastName?.trim() ?? '';
  const fullName = [first, last].filter(Boolean).join(' ') || 'Volunteer';


  const dobLabel = (() => {
    const raw = volunteer.dateOfBirth;
    if (!raw) return undefined;

    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return undefined;

    const formatted = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    return `DOB: ${formatted}`;
  })();


  // Approved hours formatting
  const hrs = volunteer.totalHoursWorked;
  const hoursLabel =
    typeof hrs !== 'number'
      ? 'Hours: —'
      : `${Number.isInteger(hrs) ? `${hrs}` : `${hrs.toFixed(1)}`} Approved Hours`;

  // Use an optional avatar later; for now a placeholder
  const avatarUrl =
    'https://i.pravatar.cc/300?img=32'; // placeholder until backend provides photo

  const emailValue = volunteer.email || undefined;
  const phoneValue = volunteer.phone || undefined;

  const statusValue = volunteer.status ? String(volunteer.status) : undefined;
  const typeValue = volunteer.volunteerType ? String(volunteer.volunteerType) : undefined;

  const textOptValue =
    typeof volunteer.textOptIn === 'boolean' ? (volunteer.textOptIn ? 'Yes' : 'No') : undefined;

  const communitySvcValue =
    typeof volunteer.needsCommunityServiceHours === 'boolean'
      ? (volunteer.needsCommunityServiceHours ? 'Yes' : 'No')
      : undefined;

  const offenderPolicyValue =
    typeof volunteer.offenderPolicyConfirmed === 'boolean'
      ? (volunteer.offenderPolicyConfirmed ? 'Confirmed' : 'Not confirmed')
      : undefined;

  const signatureValue = volunteer.signatureName || undefined;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <ProfileHeaderCard
          fullName={fullName}
          subtitle={dobLabel}
          pillText={hoursLabel}
          avatar={
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
          }
          displayId={volunteer.displayId}
        />
      </View>

      <View style={styles.rows}>
        <InfoRowCard icon="mail" label="Email" value={emailValue} />
        <InfoRowCard icon="call" label="Phone" value={phoneValue} />

        <InfoRowCard icon="person" label="Volunteer Type" value={typeValue} />
        <InfoRowCard icon="checkmark-circle" label="Status" value={statusValue} />

        <InfoRowCard icon="chatbubble-ellipses" label="Text Opt-In" value={textOptValue} />
        <InfoRowCard
          icon="school"
          label="Community Service Hours"
          value={communitySvcValue}
        />

        <InfoRowCard
          icon="document-text"
          label="Offender Policy"
          value={offenderPolicyValue}
        />

        <InfoRowCard
          icon="pencil"
          label="Electronic Signature"
          value={signatureValue}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },
  content: {
    padding: 16,
    paddingBottom: TAB_BAR_OVERLAY_HEIGHT,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  rows: {
    marginTop: 16,
    gap: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
});

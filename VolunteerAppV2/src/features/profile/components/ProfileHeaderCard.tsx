import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  fullName: string;
  subtitle?: string;          // DOB line
  pillText: string;           // "42.5 Approved Hours"
  displayId?: string;         // VOL-0001
  avatar: React.ReactNode;    // passed in so this stays flexible
};

/**
 * Large hero-style header for the Profile screen.
 * Presentation-only.
 */
export default function ProfileHeaderCard({
  fullName,
  subtitle,
  pillText,
  displayId,
  avatar,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarRing}>{avatar}</View>

      <Text style={styles.name}>{fullName}</Text>

      {displayId && <Text style={styles.displayId}>{displayId}</Text>}

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.pill}>
        <Text style={styles.pillText}>{pillText}</Text>
      </View>
    </View>
  );
}

const NAVY = '#312E81FF';
const MUTED = '#7A7F97';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 56,
    backgroundColor: '#EEF0F7',
    marginBottom: 12,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: NAVY,
    textAlign: 'center',
  },
  displayId: {
    fontSize: 14,
    color: MUTED,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    color: MUTED,
    marginTop: 6,
  },
  pill: {
    marginTop: 14,
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

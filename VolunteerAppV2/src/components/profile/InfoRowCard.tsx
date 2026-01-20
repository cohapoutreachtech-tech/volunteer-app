import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string;
};

/**
 * Reusable profile info row card.
 * - Icon in a soft circle
 * - Small uppercase label
 * - Bold value
 */
export default function InfoRowCard({ icon, label, value }: Props) {
  if (!value) return null; // hide rows with missing data (clean UI)

  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={22} color={NAVY} />
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const NAVY = '#312E81';
const MUTED = '#7A7F97';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: MUTED,
    letterSpacing: 0.8,
    marginBottom: 3,
    fontWeight: '700',
  },
  value: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
});

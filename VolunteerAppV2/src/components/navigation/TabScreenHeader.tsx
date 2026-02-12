import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

const THEME = {
  primary: '#312e81',
  textMain: '#111827',
  textSub: '#6B7280',
} as const;

/**
 * SwiftUI-like in-content header.
 * Navigation headers are disabled in this app, so each tab renders its own.
 */
export default function TabScreenHeader({ title, subtitle, right }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: Math.max(12, insets.top + 6) }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.title}>{title}</Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {!!right && <View style={styles.right}>{right}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    columnGap: 12,
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: 'rgba(17, 24, 39, 0.82)',
    ...(Platform.OS === 'ios' ? { lineHeight: 40 } : null),
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(107, 114, 128, 0.78)',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
});
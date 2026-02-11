import { BlurView } from 'expo-blur';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  CalendarClock,
  LayoutDashboard,
  Megaphone,
  UserCircle,
} from 'lucide-react-native';
import React from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#312e81',
  primaryFg: '#e0e7ff',
  muted: '#6B7280',
  border: '#E5E7EB',
} as const;

type RouteIcon = typeof LayoutDashboard;

function getIconForRoute(routeName: string): RouteIcon {
  switch (routeName) {
    case 'index':
      return LayoutDashboard;
    case 'shifts':
      return CalendarClock;
    case 'announcements':
      return Megaphone;
    case 'profile':
      return UserCircle;
    default:
      return LayoutDashboard;
  }
}

function getLabelForRoute(routeName: string): string {
  switch (routeName) {
    case 'index':
      return 'Dashboard';
    case 'shifts':
      return 'Shifts';
    case 'announcements':
      return 'News';
    case 'profile':
      return 'Profile';
    default:
      return routeName;
  }
}

type TabButtonProps = {
  label: string;
  isFocused: boolean;
  icon: RouteIcon;
  onPress: () => void;
  onLongPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

function TabButton({
  label,
  isFocused,
  icon: Icon,
  onPress,
  onLongPress,
  accessibilityLabel,
  testID,
}: TabButtonProps) {
  const baseScale = isFocused ? 1.05 : 1;
  const scaleAnim = React.useRef(new Animated.Value(baseScale)).current;

  React.useEffect(() => {
    scaleAnim.setValue(baseScale);
  }, [baseScale, scaleAnim]);

  const pressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.92,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: baseScale,
      useNativeDriver: true,
      friction: 7,
      tension: 120,
    }).start();
  };

  const iconColor = isFocused ? COLORS.primaryFg : COLORS.muted;
  const labelStyle = isFocused ? styles.labelActive : styles.labelInactive;
  const iconContainerStyle = isFocused
    ? styles.iconContainerActive
    : styles.iconContainerInactive;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={styles.tabItem}
    >
      <Animated.View
        style={[
          iconContainerStyle,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Icon color={iconColor} size={20} strokeWidth={isFocused ? 2.2 : 1.6} />
      </Animated.View>

      <Text style={labelStyle}>{label}</Text>
    </Pressable>
  );
}

export const TAB_BAR_OVERLAY_HEIGHT = 96;

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(28, insets.bottom);

  return (
    <BlurView
      intensity={60}
      tint="light"
      style={[styles.tabBarContainer, { paddingBottom }]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const label = getLabelForRoute(route.name);
        const Icon = getIconForRoute(route.name);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabButton
            key={route.key}
            label={label}
            isFocused={isFocused}
            icon={Icon}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityLabel={descriptors[route.key]?.options?.tabBarAccessibilityLabel}
            testID={descriptors[route.key]?.options?.tabBarButtonTestID}
          />
        );
      })}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 64,
    gap: 2,
  },
  iconContainerInactive: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    transform: [{ scale: 1.05 }],
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  labelInactive: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: COLORS.muted,
  },
  labelActive: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: COLORS.primary,
  },
});

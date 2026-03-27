import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActionSheetIOS,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Font, FontSize } from '@/constants/theme';

// Routes order must match (tabs)/_layout.tsx Tabs.Screen order:
// index → FRIENDS, diary → DIARY, recipe → RECIPE, profile → PROFILE
const TAB_LABELS: Record<string, string> = {
  index: 'FRIENDS',
  diary: 'DIARY',
  recipe: 'RECIPE',
  profile: 'PROFILE',
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const visibleRoutes = state.routes.filter(
    (r) => (descriptors[r.key]?.options as any)?.href !== null
  );

  const half = Math.floor(visibleRoutes.length / 2); // 2
  const leftRoutes = visibleRoutes.slice(0, half);   // FRIENDS, DIARY
  const rightRoutes = visibleRoutes.slice(half);     // RECIPE, PROFILE

  const handleDuckPress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['New Post', 'Notifications', 'Settings', 'Cancel'],
        cancelButtonIndex: 3,
      },
      (index) => {
        if (index === 0) router.push('/post/create');
        // Settings / Notifications: wire up later
      }
    );
  };

  const renderTab = (route: typeof state.routes[0]) => {
    const isFocused = state.routes[state.index].name === route.name;
    const label = TAB_LABELS[route.name] ?? route.name.toUpperCase();

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

    return (
      <TouchableOpacity
        key={route.key}
        style={styles.tab}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>
        {/* Left tabs */}
        <View style={styles.side}>{leftRoutes.map(renderTab)}</View>

        {/* Duck button */}
        <View style={styles.duckWrapper}>
          <TouchableOpacity
            style={styles.duckButton}
            onPress={handleDuckPress}
            activeOpacity={0.8}
          >
            <Image source={require('@/assets/images/duck_logo.png')} style={styles.duckEmoji} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {/* Right tabs */}
        <View style={styles.side}>{rightRoutes.map(renderTab)}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 56,
  },
  side: {
    flex: 1,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
  },
  tabLabel: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#AAAAAA',
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: '#000',
  },
  duckWrapper: {
    width: 72,
    alignItems: 'center',
    // Rise the button above the bar
    position: 'relative',
    bottom: 10,
  },
  duckButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    // Subtle shadow so it floats
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  duckEmoji: {
    width: 32,
    height: 32,
  },
});

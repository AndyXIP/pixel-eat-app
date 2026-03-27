import { Platform } from 'react-native';

// Pixel Eat design tokens
export const Colors = {
  // Legacy light/dark shape kept for components not yet migrated
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#000',
    icon: '#687076',
    tabIconDefault: '#AAAAAA',
    tabIconSelected: '#000',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
  // App-level tokens
  background: '#ffffff',
  text: '#000000',
  textSecondary: '#999999',
  accent: '#E05252',
  accentGreen: '#2ECC71',
  border: '#eeeeee',
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'system-ui',
    serif: 'Georgia, serif',
    rounded: 'system-ui',
    mono: 'monospace',
  },
});

// Pixel font family name (Micro 5 from @expo-google-fonts/micro-5)
export const Font = {
  pixel: 'Micro5_400Regular',
};

// App-wide font size scale — edit here to resize everything at once
export const FontSize = {
  xs:      14,  // tiny secondary labels
  sm:      16,  // timestamps, meta text
  md:      18,  // primary body, names
  lg:      20,  // section headers
  xl:      26,  // screen titles, display names
  stat:    32,  // stat numbers
  display: 80,  // big one-off numbers (diary duck)
};

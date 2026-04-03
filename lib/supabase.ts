import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// AsyncStorage references `window` which doesn't exist during Expo's web SSR
// pre-render (Node.js). Only import and use it on native.
const storage = Platform.OS !== 'web'
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ? require('@react-native-async-storage/async-storage').default
  : undefined; // web: Supabase uses localStorage automatically in the browser

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  }
);

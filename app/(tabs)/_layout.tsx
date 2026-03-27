import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'FRIENDS' }} />
      <Tabs.Screen name="diary" options={{ title: 'DIARY' }} />
      <Tabs.Screen name="recipe" options={{ title: 'RECIPE' }} />
      <Tabs.Screen name="profile" options={{ title: 'PROFILE' }} />
    </Tabs>
  );
}

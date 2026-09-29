import { Redirect, Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/profitkart';
import { useAuth } from '@/contexts/auth-context';

export default function MarketplaceTabs() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Palette.primary} size="large" />
      </View>
    );
  }
  if (!user) return <Redirect href="/" />;

  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Palette.primary,
        tabBarInactiveTintColor: Palette.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        tabBarStyle: { backgroundColor: Palette.white, borderTopColor: Palette.line },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <SymbolView name={{ ios: 'square.grid.2x2.fill', android: 'dashboard', web: 'dashboard' }} tintColor={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color, size }) => (
            <SymbolView name={{ ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' }} tintColor={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <SymbolView name={{ ios: 'bell.fill', android: 'notifications', web: 'notifications' }} tintColor={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <SymbolView name={{ ios: 'person.fill', android: 'person', web: 'person' }} tintColor={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.canvas },
});
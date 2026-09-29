import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DashboardCard } from '@/components/DashboardCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Palette } from '@/constants/profitkart';
import { useAuth } from '@/contexts/auth-context';
import { getDashboard } from '@/services/api';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let active = true;
    getDashboard()
      .then((data) => {
        if (active) setStats(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Could not load dashboard statistics.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshCount]);

  function retryDashboard() {
    setLoading(true);
    setError('');
    setRefreshCount((count) => count + 1);
  }

  function statValue(key) {
    if (loading) return '...';
    if (error) return '--';
    return String(Number(stats?.[key]) || 0);
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topline}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>P</Text></View>
          <Text style={styles.brandName}>ProfitKart</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() ?? 'S'}</Text>
          </View>
        </View>

        <ScreenHeader
          eyebrow="SELLER OVERVIEW"
          title={`Hello, ${user?.name ?? 'Seller'}`}
          subtitle="Here is what's happening with your store today."
        />

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Your business</Text>
          {loading && <ActivityIndicator size="small" color={Palette.primary} />}
        </View>

        <View style={styles.cards}>
          <DashboardCard
            accent
            detail="Items in your catalog"
            icon="▦"
            label="Total products"
            onPress={() => router.navigate('/products')}
            value={statValue('totalProducts')}
          />
          <DashboardCard
            detail="Orders across your store"
            icon="◇"
            label="Total orders"
            onPress={() => router.navigate('/products')}
            value={statValue('totalOrders')}
          />
          <DashboardCard
            detail="Updates for your store"
            icon="◉"
            label="Total notifications"
            onPress={() => router.navigate('/notifications')}
            value={statValue('totalNotifications')}
          />
          <DashboardCard
            detail="Your seller account"
            icon="○"
            label="Profile"
            onPress={() => router.navigate('/profile')}
            value="View"
          />
        </View>

        {!!error && (
          <Pressable onPress={retryDashboard} style={styles.retryButton}>
            <Text style={styles.retryText}>{error} · Tap to retry</Text>
          </Pressable>
        )}

        <View style={styles.note}>
          <View style={styles.noteAccent} />
          <View style={styles.noteCopy}>
            <Text style={styles.noteTitle}>Keep your catalog current</Text>
            <Text style={styles.noteText}>Well-described products make it easier for customers to find your store.</Text>
          </View>
          <Text style={styles.noteIcon}>✳</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.canvas },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 28, width: '100%', maxWidth: 720, alignSelf: 'center' },
  topline: { flexDirection: 'row', alignItems: 'center', marginBottom: 29 },
  brandMark: { width: 31, height: 31, borderRadius: 10, backgroundColor: Palette.primary, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: Palette.white, fontWeight: '800', fontSize: 19 },
  brandName: { color: Palette.ink, fontWeight: '800', fontSize: 15, marginLeft: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0E8DC', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' },
  avatarText: { color: '#795524', fontWeight: '800', fontSize: 14 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 },
  sectionTitle: { color: Palette.ink, fontSize: 15, fontWeight: '800' },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  retryButton: { alignSelf: 'flex-start', paddingVertical: 10 },
  retryText: { color: Palette.danger, fontSize: 12 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: '#F2EDE5', borderRadius: 8, marginTop: 25, padding: 15, overflow: 'hidden' },
  noteAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: Palette.gold },
  noteCopy: { flex: 1, gap: 4 },
  noteTitle: { color: Palette.ink, fontSize: 13, fontWeight: '800' },
  noteText: { color: Palette.secondary, fontSize: 12, lineHeight: 18 },
  noteIcon: { color: '#B28137', fontSize: 24 },
});
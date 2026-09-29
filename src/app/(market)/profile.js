import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ScreenHeader';
import { Palette } from '@/constants/profitkart';
import { useAuth } from '@/contexts/auth-context';
import { getProfile } from '@/services/api';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Could not load your profile.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshCount]);

  function retryProfile() {
    setLoading(true);
    setError('');
    setRefreshCount((count) => count + 1);
  }

  async function handleLogout() {
    await signOut();
    router.replace('/');
  }

  const displayProfile = profile ?? user;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.content}>
        <ScreenHeader
          eyebrow="SELLER ACCOUNT"
          title="Profile"
          subtitle="Your personal and account information."
        />

        {loading && <ActivityIndicator color={Palette.primary} style={styles.status} />}
        {!!error && (
          <Pressable onPress={retryProfile} style={styles.status}>
            <Text style={styles.error}>{error} · Tap to retry</Text>
          </Pressable>
        )}

        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayProfile?.name?.[0]?.toUpperCase() ?? 'S'}</Text>
          </View>
          <Text style={styles.name}>{displayProfile?.name ?? 'Seller'}</Text>
          <Text style={styles.email}>{displayProfile?.email ?? ''}</Text>
        </View>

        <Text style={styles.sectionTitle}>Profile information</Text>
        <View style={styles.infoList}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full name</Text>
            <Text style={styles.infoValue}>{displayProfile?.name ?? 'Seller'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email address</Text>
            <Text numberOfLines={2} style={styles.infoValue}>{displayProfile?.email ?? 'Not provided'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account type</Text>
            <Text style={styles.infoValue}>Marketplace seller</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleLogout}
          style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.canvas },
  content: { paddingHorizontal: 20, paddingTop: 20, width: '100%', maxWidth: 680, alignSelf: 'center' },
  status: { marginTop: -12, marginBottom: 14 },
  error: { color: Palette.danger, fontSize: 12, textAlign: 'center' },
  identity: { alignItems: 'center', paddingVertical: 24, borderRadius: 8, borderWidth: 1, borderColor: Palette.line, backgroundColor: Palette.white, marginBottom: 25 },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: Palette.primary, fontSize: 27, fontWeight: '800' },
  name: { color: Palette.ink, fontSize: 17, fontWeight: '800' },
  email: { color: Palette.secondary, fontSize: 13, marginTop: 5 },
  sectionTitle: { color: Palette.ink, fontSize: 15, fontWeight: '800', marginBottom: 11 },
  infoList: { borderRadius: 8, borderWidth: 1, borderColor: Palette.line, backgroundColor: Palette.white, paddingHorizontal: 15 },
  infoRow: { minHeight: 57, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 15 },
  infoLabel: { color: Palette.secondary, fontSize: 12 },
  infoValue: { flexShrink: 1, color: Palette.ink, fontSize: 12, fontWeight: '700', textAlign: 'right' },
  divider: { height: 1, backgroundColor: Palette.line },
  logoutButton: { minHeight: 50, borderRadius: 8, borderWidth: 1, borderColor: '#E9C9C6', backgroundColor: '#FFF8F7', alignItems: 'center', justifyContent: 'center', marginTop: 26 },
  logoutText: { color: Palette.danger, fontSize: 14, fontWeight: '800' },
  pressed: { opacity: 0.8 },
});
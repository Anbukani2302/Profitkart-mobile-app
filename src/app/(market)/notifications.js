import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NotificationCard } from '@/components/NotificationCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Palette } from '@/constants/profitkart';
import { getNotifications } from '@/services/api';

function normalizeNotification(item, index) {
  const time = item.time ?? (item.createdAt ? new Date(item.createdAt).toLocaleString() : '');
  return {
    id: String(item.id ?? item._id ?? index),
    title: item.title ?? 'Notification',
    message: item.message ?? '',
    time,
    read: Boolean(item.read),
  };
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let active = true;
    getNotifications()
      .then((items) => {
        if (active) setNotifications(items.map(normalizeNotification));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Could not load notifications.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshCount]);

  function refreshNotifications() {
    setLoading(true);
    setError('');
    setRefreshCount((count) => count + 1);
  }

  function markAsRead(id) {
    setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item));
  }

  function markAllAsRead() {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const emptyState = loading ? (
    <View style={styles.emptyState}>
      <ActivityIndicator color={Palette.primary} size="large" />
      <Text style={styles.empty}>Loading notifications</Text>
    </View>
  ) : error ? (
    <View style={styles.emptyState}>
      <Text style={styles.empty}>{error}</Text>
      <Pressable onPress={refreshNotifications} style={styles.retryButton}>
        <Text style={styles.retryText}>Try again</Text>
      </Pressable>
    </View>
  ) : (
    <Text style={styles.empty}>You are all caught up.</Text>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.content}
        data={notifications}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={emptyState}
        ListHeaderComponent={
          <>
            <ScreenHeader
              eyebrow="STORE ACTIVITY"
              title="Notifications"
              subtitle="Updates and reminders for your seller account."
            />
            <View style={styles.listHeading}>
              <Text style={styles.listTitle}>Recent activity</Text>
              {!loading && unreadCount > 0 && (
                <Pressable accessibilityRole="button" onPress={markAllAsRead}>
                  <Text style={styles.markAll}>Mark all read</Text>
                </Pressable>
              )}
            </View>
          </>
        }
        onRefresh={refreshNotifications}
        refreshing={loading && notifications.length > 0}
        renderItem={({ item }) => (
          <NotificationCard notification={item} onPress={() => markAsRead(item.id)} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.canvas },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30, width: '100%', maxWidth: 680, alignSelf: 'center', flexGrow: 1 },
  listHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  listTitle: { color: Palette.ink, fontSize: 15, fontWeight: '800' },
  markAll: { color: Palette.primary, fontSize: 12, fontWeight: '700' },
  separator: { height: 10 },
  emptyState: { alignItems: 'center', justifyContent: 'center', minHeight: 280, gap: 10, paddingHorizontal: 20 },
  empty: { color: Palette.secondary, textAlign: 'center', marginTop: 75, fontSize: 14 },
  retryButton: { minHeight: 40, paddingHorizontal: 17, justifyContent: 'center', borderRadius: 7, backgroundColor: Palette.primary },
  retryText: { color: Palette.white, fontSize: 13, fontWeight: '700' },
});
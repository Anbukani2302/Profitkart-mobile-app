import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/profitkart';

export function NotificationCard({ notification, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${notification.read ? 'Read' : 'Unread'} notification: ${notification.title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, !notification.read && styles.unread, pressed && styles.pressed]}>
      <View style={[styles.marker, notification.read && styles.readMarker]}>
        <Text style={[styles.markerText, notification.read && styles.readMarkerText]}>
          {notification.read ? '✓' : '•'}
        </Text>
      </View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>{notification.title}</Text>
          {!notification.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.time}>{notification.time}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 13, borderRadius: 8, borderWidth: 1, borderColor: Palette.line, backgroundColor: Palette.white, padding: 15 },
  unread: { backgroundColor: '#F5F1FC', borderColor: '#E7DDF8' },
  marker: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.primary, marginTop: 2 },
  markerText: { color: Palette.white, fontSize: 17, fontWeight: '800' },
  readMarker: { backgroundColor: '#E8E5EC' },
  readMarkerText: { color: Palette.secondary, fontSize: 13 },
  copy: { flex: 1, gap: 5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  title: { flexShrink: 1, color: Palette.ink, fontSize: 14, fontWeight: '800' },
  unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Palette.primary },
  message: { color: Palette.secondary, fontSize: 12, lineHeight: 18 },
  time: { color: Palette.muted, fontSize: 11, marginTop: 2 },
  pressed: { opacity: 0.8 },
});
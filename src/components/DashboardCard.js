import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/profitkart';

export function DashboardCard({ label, value, detail, icon, accent = false, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, accent && styles.accentCard, pressed && styles.pressed]}>
      <View style={styles.topRow}>
        <Text style={[styles.icon, accent && styles.accentIcon]}>{icon}</Text>
        <Text style={[styles.arrow, accent && styles.accentArrow]}>↗</Text>
      </View>
      <Text style={[styles.value, accent && styles.accentValue]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={[styles.label, accent && styles.accentLabel]}>{label}</Text>
      <Text style={[styles.detail, accent && styles.accentDetail]} numberOfLines={1}>
        {detail}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexBasis: '47%', flexGrow: 1, minWidth: 140, minHeight: 154, padding: 16, borderRadius: 8, backgroundColor: Palette.white, borderWidth: 1, borderColor: Palette.line },
  accentCard: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  icon: { color: Palette.primary, fontSize: 19 },
  arrow: { color: Palette.muted, fontSize: 17 },
  value: { color: Palette.ink, fontSize: 27, fontWeight: '800', marginTop: 13 },
  label: { color: Palette.ink, fontSize: 13, fontWeight: '700', marginTop: 2 },
  detail: { color: Palette.secondary, fontSize: 11, marginTop: 5 },
  accentIcon: { color: '#E4D8FF' },
  accentArrow: { color: '#D7C7F5' },
  accentValue: { color: Palette.white },
  accentLabel: { color: Palette.white },
  accentDetail: { color: '#DED2F6' },
  pressed: { opacity: 0.84 },
});
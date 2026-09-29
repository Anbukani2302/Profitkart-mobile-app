import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/profitkart';

export function ScreenHeader({ eyebrow, title, subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 22 },
  eyebrow: { color: Palette.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { color: Palette.ink, fontSize: 29, fontWeight: '800', marginTop: 5 },
  subtitle: { color: Palette.secondary, fontSize: 13, lineHeight: 19, marginTop: 5 },
});
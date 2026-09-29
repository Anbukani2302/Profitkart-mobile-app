import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/profitkart';

export function ProductCard({ product }) {
  const [imageLoading, setImageLoading] = useState(Boolean(product.image));
  const [imageFailed, setImageFailed] = useState(!product.image);
  const price = Number.isFinite(Number(product.price))
    ? `₹${Number(product.price).toLocaleString('en-IN')}`
    : 'Price unavailable';

  return (
    <View style={styles.card}>
      <View style={styles.imageFrame}>
        {!!product.image && !imageFailed && (
          <Image
            contentFit="cover"
            onError={() => {
              setImageFailed(true);
              setImageLoading(false);
            }}
            onLoad={() => setImageLoading(false)}
            source={{ uri: product.image }}
            style={styles.image}
            transition={180}
          />
        )}
        {(imageFailed || imageLoading) && (
          <View style={styles.imageFallback}>
            {imageLoading ? (
              <ActivityIndicator color={Palette.primary} />
            ) : (
              <Text style={styles.imageFallbackIcon}>▧</Text>
            )}
            {imageFailed && <Text style={styles.imageFallbackText}>Image unavailable</Text>}
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text numberOfLines={1} style={styles.name}>{product.name || 'Unnamed product'}</Text>
        <Text numberOfLines={2} style={styles.description}>{product.description || 'No description available.'}</Text>
        <View style={styles.purchaseRow}>
          <Text style={styles.price}>{price}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert('Coming soon', 'Checkout will be available soon.')}
            style={({ pressed }) => [styles.buyButton, pressed && styles.pressed]}>
            <Text style={styles.buyText}>Buy now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Palette.white, borderRadius: 8, borderWidth: 1, borderColor: Palette.line, overflow: 'hidden' },
  imageFrame: { height: 170, backgroundColor: '#F0EDF4', alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
  imageFallback: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', gap: 5 },
  imageFallbackIcon: { fontSize: 29, color: '#A49BAF' },
  imageFallbackText: { color: Palette.muted, fontSize: 11 },
  details: { padding: 14 },
  name: { color: Palette.ink, fontSize: 15, fontWeight: '800' },
  description: { minHeight: 34, color: Palette.secondary, fontSize: 12, lineHeight: 17, marginTop: 5 },
  purchaseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 11 },
  price: { flexShrink: 1, color: Palette.ink, fontSize: 17, fontWeight: '800' },
  buyButton: { minHeight: 38, paddingHorizontal: 15, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.primary },
  buyText: { color: Palette.white, fontSize: 12, fontWeight: '700' },
  pressed: { opacity: 0.82 },
});
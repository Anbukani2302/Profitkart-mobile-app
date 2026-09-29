import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/ProductCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Palette } from '@/constants/profitkart';
import { getProducts } from '@/services/api';

export default function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let active = true;
    getProducts()
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Could not load products.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshCount]);

  function refreshProducts() {
    setLoading(true);
    setError('');
    setRefreshCount((count) => count + 1);
  }

  const emptyState = loading ? (
    <View style={styles.state}>
      <ActivityIndicator color={Palette.primary} size="large" />
      <Text style={styles.stateTitle}>Loading products</Text>
    </View>
  ) : error ? (
    <View style={styles.state}>
      <Text style={styles.stateIcon}>!</Text>
      <Text style={styles.stateTitle}>Products could not load</Text>
      <Text style={styles.stateMessage}>{error}</Text>
      <Pressable onPress={refreshProducts} style={styles.retryButton}>
        <Text style={styles.retryText}>Try again</Text>
      </Pressable>
    </View>
  ) : (
    <View style={styles.state}>
      <Text style={styles.stateIcon}>▦</Text>
      <Text style={styles.stateTitle}>No products yet</Text>
      <Text style={styles.stateMessage}>Products from your store will appear here.</Text>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={products}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item, index) => item._id || `product-${index}`}
        ListEmptyComponent={emptyState}
        ListHeaderComponent={
          <>
            <ScreenHeader
              eyebrow="YOUR CATALOG"
              title="Products"
              subtitle="Browse the products available in your marketplace."
            />
            <View style={styles.listHeading}>
              <Text style={styles.listTitle}>All products</Text>
              {!loading && !error && <Text style={styles.count}>{products.length} items</Text>}
            </View>
          </>
        }
        onRefresh={refreshProducts}
        refreshing={loading && products.length > 0}
        renderItem={({ item }) => <ProductCard product={item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.canvas },
  listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30, width: '100%', maxWidth: 680, alignSelf: 'center', flexGrow: 1 },
  listHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  listTitle: { color: Palette.ink, fontSize: 15, fontWeight: '800' },
  count: { color: Palette.secondary, fontSize: 12 },
  separator: { height: 13 },
  state: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', minHeight: 280, paddingHorizontal: 20, gap: 9 },
  stateIcon: { color: Palette.primary, backgroundColor: Palette.primarySoft, overflow: 'hidden', paddingHorizontal: 17, paddingVertical: 7, borderRadius: 24, fontSize: 24, fontWeight: '800' },
  stateTitle: { color: Palette.ink, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  stateMessage: { color: Palette.secondary, fontSize: 13, textAlign: 'center', lineHeight: 19 },
  retryButton: { minHeight: 40, paddingHorizontal: 17, justifyContent: 'center', borderRadius: 7, backgroundColor: Palette.primary, marginTop: 5 },
  retryText: { color: Palette.white, fontSize: 13, fontWeight: '700' },
});
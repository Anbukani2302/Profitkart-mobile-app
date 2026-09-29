import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Palette } from '@/constants/profitkart';
import { useAuth } from '@/contexts/auth-context';

export default function LoginScreen() {
  const { user, isLoading: sessionLoading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (sessionLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator color={Palette.primary} size="large" />
      </SafeAreaView>
    );
  }
  if (user) return <Redirect href="/dashboard" />;

  async function handleLogin() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Enter your password to continue.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signIn(normalizedEmail, password);
      router.replace('/dashboard');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>ProfitKart</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email"
            returnKeyType="next"
            style={styles.input}
            value={email}
          />
          <View style={styles.passwordRow}>
            <TextInput
              accessibilityLabel="Password"
              autoComplete="password"
              onChangeText={setPassword}
              onSubmitEditing={handleLogin}
              placeholder="Password"
              returnKeyType="go"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              value={password}
            />
            <Pressable
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              onPress={() => setShowPassword((visible) => !visible)}
              style={styles.showPassword}>
              <Text style={styles.showPasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </Pressable>
          </View>
          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Pressable disabled={loading} onPress={handleLogin} style={styles.button}>
            {loading ? (
              <ActivityIndicator color={Palette.white} />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, justifyContent: 'center', backgroundColor: Palette.canvas },
  keyboardView: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    backgroundColor: Palette.canvas,
  },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: Palette.primary },
  subtitle: { textAlign: 'center', marginTop: 8, marginBottom: 30, color: '#666' },
  input: {
    height: 53,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    color: Palette.ink,
    backgroundColor: Palette.white,
  },
  passwordRow: {
    minHeight: 53,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: Palette.white,
  },
  passwordInput: { flex: 1, height: '100%', paddingHorizontal: 14, color: Palette.ink },
  showPassword: { padding: 14 },
  showPasswordText: { color: Palette.primary, fontWeight: '700' },
  error: { color: Palette.danger, fontSize: 13, marginBottom: 12 },
  button: {
    minHeight: 53,
    backgroundColor: Palette.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: Palette.white, fontSize: 17, fontWeight: 'bold' },
});
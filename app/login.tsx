import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Font, FontSize } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError(null);

    const { error } = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) setError(error.message);
    setLoading(false);
    // on success, _layout.tsx catches the session change and redirects automatically
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.logo}>pixel eat</Text>
        <Text style={styles.tagline}>cook. log. share.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#bbb"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#bbb"
            secureTextEntry
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[styles.btn, (!email.trim() || !password.trim()) && styles.btnDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading || !email.trim() || !password.trim()}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>{mode === 'signin' ? 'SIGN IN' : 'SIGN UP'}</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(null); }}
            activeOpacity={0.7}
          >
            <Text style={styles.switchText}>
              {mode === 'signin' ? 'no account? sign up' : 'have an account? sign in'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    fontFamily: Font.pixel,
    fontSize: 48,
    color: '#E05252',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#aaa',
    marginBottom: 48,
    letterSpacing: 1,
  },
  form: {
    width: '100%',
  },
  label: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#aaa',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#000',
    backgroundColor: '#fafafa',
  },
  error: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#E05252',
    marginTop: 12,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  btnDisabled: {
    opacity: 0.35,
  },
  btnText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#fff',
    letterSpacing: 1,
  },
  switchBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#888',
  },
});

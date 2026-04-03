import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { PostCard } from '@/components/PostCard';
import { useApi } from '@/hooks/useApi';
import { getFeed, searchUsers, addFriend, type ApiUser } from '@/services/api';
import { Font, FontSize } from '@/constants/theme';

// ── Add friends modal ─────────────────────────────────────────────────────────

function AddModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ApiUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setSearching(true);
    searchUsers(query)
      .then(data => { if (!cancelled) setResults(data); })
      .finally(() => { if (!cancelled) setSearching(false); });
    return () => { cancelled = true; };
  }, [query]);

  return (
    <Modal visible animationType="slide" transparent>
      <Pressable style={modal.backdrop} onPress={onClose}>
        <Pressable style={modal.card} onPress={() => {}}>

          {/* New post shortcut */}
          <TouchableOpacity
            style={modal.newPostBtn}
            activeOpacity={0.8}
            onPress={() => { onClose(); router.push('/post/create'); }}
          >
            <Text style={modal.newPostText}>+ NEW POST</Text>
          </TouchableOpacity>

          <View style={modal.divider} />

          {/* Friend search */}
          <Text style={modal.sectionLabel}>ADD FRIEND</Text>
          <TextInput
            style={modal.searchInput}
            placeholder="search by username..."
            placeholderTextColor="#bbb"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />

          {searching ? (
            <ActivityIndicator style={{ marginTop: 16 }} />
          ) : (
            <ScrollView style={modal.resultsList} showsVerticalScrollIndicator={false}>
              {results.map(user => (
                <View key={user.id} style={modal.userRow}>
                  <Image source={{ uri: user.avatarUrl }} style={modal.avatar} resizeMode="cover" />
                  <View style={modal.userInfo}>
                    <Text style={modal.displayName}>{user.displayName}</Text>
                    <Text style={modal.username}>@{user.username}</Text>
                  </View>
                  <TouchableOpacity
                    style={[modal.addBtn, added.has(user.id) && modal.addBtnDone]}
                    activeOpacity={0.7}
                    disabled={added.has(user.id) || adding.has(user.id)}
                    onPress={async () => {
                      setAdding(prev => new Set([...prev, user.id]));
                      await addFriend(user.id).catch(() => {});
                      setAdded(prev => new Set([...prev, user.id]));
                      setAdding(prev => { const s = new Set(prev); s.delete(user.id); return s; });
                    }}
                  >
                    <Text style={[modal.addBtnText, added.has(user.id) && modal.addBtnTextDone]}>
                      {adding.has(user.id) ? '...' : added.has(user.id) ? 'ADDED' : 'ADD'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

        </Pressable>
      </Pressable>
    </Modal>
  );
}

const modal = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '75%',
  },
  newPostBtn: {
    backgroundColor: '#E05252',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  newPostText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#fff',
    letterSpacing: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee',
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#aaa',
    letterSpacing: 1,
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1.5,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#000',
    backgroundColor: '#fafafa',
    marginBottom: 12,
  },
  resultsList: {
    flexGrow: 0,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#000',
  },
  username: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#aaa',
  },
  addBtn: {
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  addBtnDone: {
    borderColor: '#ccc',
  },
  addBtnText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#000',
  },
  addBtnTextDone: {
    color: '#ccc',
  },
});

// ── Screen ────────────────────────────────────────────────────────────────────

export default function FriendsScreen() {
  const { data: posts, loading } = useApi(getFeed);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FRIENDS</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setAddOpen(true)} activeOpacity={0.7}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading || !posts ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
        <View style={styles.footer} />
      </ScrollView>

      {addOpen && <AddModal onClose={() => setAddOpen(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontFamily: Font.pixel,
    fontSize: FontSize.lg,
    color: '#000',
    letterSpacing: 0.5,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 28,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 12,
  },
  loader: {
    marginTop: 40,
  },
  footer: {
    height: 16,
  },
});

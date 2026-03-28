import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PostCard } from '@/components/PostCard';
import { useApi } from '@/hooks/useApi';
import { getFeed } from '@/services/api';

export default function FriendsScreen() {
  const { data: posts, loading } = useApi(getFeed);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
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

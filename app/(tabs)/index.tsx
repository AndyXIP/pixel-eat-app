import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PostCard } from '@/components/PostCard';
import { FEED_POSTS } from '@/constants/mockData';

export default function FriendsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {FEED_POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
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
  footer: {
    height: 16,
  },
});

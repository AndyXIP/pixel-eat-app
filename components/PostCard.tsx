import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SpriteCompositor } from './SpriteCompositor';
import { Font, FontSize } from '@/constants/theme';
import { CircleCountryFlag, type CountryCode } from 'react-native-circle-flags';

type Post = {
  id: string;
  photoUrl: string;
  cuisine: string;
  user: {
    displayName: string;
    username: string;
    avatarUrl: string;
  };
  date: string;
  caption: string;
  timeAgo: string;
  ingredients: {
    vessel: string;
    base: string;
    toppings: string[];
  };
  spriteColors: { bg: string; accent: string };
  isHot: boolean;
};

export function PostCard({ post }: { post: Post }) {
  const [spriteMain, setSpriteMain] = useState(false);
  const photoSource = { uri: post.photoUrl };
  const avatarSource = post.user.avatarUrl ? { uri: post.user.avatarUrl } : null;

  return (
    <View style={styles.wrapper}>
      {/* User header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {avatarSource ? <Image source={avatarSource} style={styles.avatar} resizeMode="cover" /> : <View style={[styles.avatar, { backgroundColor: '#eee' }]} />}
          <View>
            <Text style={styles.displayName}>{post.user.displayName}</Text>
            <Text style={styles.username}>@{post.user.username}</Text>
          </View>
        </View>
        <Text style={styles.date}>{post.date}</Text>
      </View>

      {/* Post card */}
      <View style={styles.card}>
        {/* Main full-bleed layer */}
        {spriteMain ? (
          <SpriteCompositor
            vessel={post.ingredients.vessel}
            base={post.ingredients.base}
            toppings={post.ingredients.toppings}
            bgColor={post.spriteColors.bg}
            accentColor={post.spriteColors.accent}
          />
        ) : (
          <View style={StyleSheet.absoluteFill}>
            <Image source={photoSource} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </View>
        )}

        {/* Thumbnail — top right, tapping swaps */}
        <TouchableOpacity style={styles.spriteThumb} onPress={() => setSpriteMain(v => !v)} activeOpacity={0.85}>
          {spriteMain ? (
            <Image source={photoSource} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <SpriteCompositor
              vessel={post.ingredients.vessel}
              base={post.ingredients.base}
              toppings={post.ingredients.toppings}
              size={72}
              bgColor={post.spriteColors.bg}
              accentColor={post.spriteColors.accent}
            />
          )}
        </TouchableOpacity>

        {/* Hot steam overlay */}
        {post.isHot && (
          <View style={styles.steamOverlay}>
            <Text style={styles.steamText}>~  ~  ~</Text>
          </View>
        )}

        {/* Caption overlay */}
        <View style={styles.captionOverlay}>
          <Text style={styles.captionText}>{post.caption}</Text>
          <Text style={styles.timeText}>{post.timeAgo}</Text>
        </View>
      </View>

      {/* Topping tags bar */}
      <View style={styles.toppingRow}>
        {post.ingredients.toppings.slice(0, 3).map((t) => (
          <View key={t} style={styles.tag}>
            <Text style={styles.tagText}>{t}</Text>
          </View>
        ))}
        {post.cuisine && (
          <View style={styles.flagTag}>
            <CircleCountryFlag code={post.cuisine as CountryCode} size={20} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontFamily: Font.pixel,
    fontSize: FontSize.lg,
    color: '#fff',
  },
  displayName: {
    fontFamily: Font.pixel,
    fontSize: FontSize.lg,
    color: '#000',
  },
  username: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#888',
  },
  date: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#000',
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    aspectRatio: 1,
    backgroundColor: '#eee',
  },
  spriteThumb: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 72,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  steamOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    opacity: 0.7,
  },
  steamText: {
    fontFamily: Font.pixel,
    fontSize: 20,
    color: '#fff',
    letterSpacing: 4,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  captionText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#fff',
    marginBottom: 4,
  },
  timeText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.75)',
  },
  toppingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ddd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f5f5f5',
  },
  flagTag: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ddd',
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xs,
    color: '#555',
  },
});

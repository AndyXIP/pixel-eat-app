import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PROFILE } from '@/constants/mockData';
import { Font, FontSize } from '@/constants/theme';

function CuisineFlags({ data }: { data: typeof PROFILE.cuisineData }) {
  const [open, setOpen] = useState(false);
  const sorted = [...data].sort((a, b) => b.pct - a.pct);
  const top = sorted[0];

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.7}>
        <Text style={flags.flag}>{top.flag}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={flags.backdrop} onPress={() => setOpen(false)}>
          <View style={flags.card}>
            <Text style={flags.cardTitle}>TOP CUISINES</Text>
            {sorted.map((item, i) => (
              <View key={item.label} style={flags.row}>
                <Text style={flags.rank}>{i + 1}</Text>
                <Text style={flags.flagSm}>{item.flag}</Text>
                <Text style={flags.label}>{item.label.toUpperCase()}</Text>
                <Text style={flags.pct}>{Math.round(item.pct * 100)}%</Text>
              </View>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const flags = StyleSheet.create({
  flag: { fontSize: 64 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    width: 240,
    gap: 12,
  },
  cardTitle: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xl,
    color: '#000',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rank: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xl,
    color: '#aaa',
    width: 20,
    textAlign: 'center',
  },
  flagSm: { fontSize: 36 },
  label: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#000',
    flex: 1,
  },
  pct: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#888',
  },
});

function StatItem({
  value,
  label,
  valueColor = '#000',
}: {
  value: number;
  label: string;
  valueColor?: string;
}) {
  return (
    <View style={stats.item}>
      <Text style={[stats.value, { color: valueColor }]}>{value}</Text>
      <Text style={stats.label}>{label}</Text>
    </View>
  );
}

const stats = StyleSheet.create({
  item: { alignItems: 'center', flex: 1 },
  value: { fontFamily: Font.pixel, fontSize: FontSize.stat, color: '#000' },
  label: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xs,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 2,
  },
});

function IngredientEmoji({ data }: { data: typeof PROFILE.ingredientData }) {
  const [open, setOpen] = useState(false);
  const sorted = [...data].sort((a, b) => b.pct - a.pct);
  const top = sorted[0];

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.7}>
        <Text style={ingr.emoji}>{top.emoji}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={ingr.backdrop} onPress={() => setOpen(false)}>
          <View style={ingr.card}>
            <Text style={ingr.cardTitle}>TOP INGREDIENTS</Text>
            {sorted.map((item, i) => (
              <View key={item.label} style={ingr.row}>
                <Text style={ingr.rank}>{i + 1}</Text>
                <Text style={ingr.emojiSm}>{item.emoji}</Text>
                <Text style={ingr.label}>{item.label.toUpperCase()}</Text>
                <Text style={ingr.pct}>{Math.round(item.pct * 100)}%</Text>
              </View>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const ingr = StyleSheet.create({
  emoji: { fontSize: 64 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    width: 240,
    gap: 12,
  },
  cardTitle: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xl,
    color: '#000',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rank: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xl,
    color: '#aaa',
    width: 20,
    textAlign: 'center',
  },
  emojiSm: { fontSize: 36 },
  label: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#000',
    flex: 1,
  },
  pct: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#888',
  },
});

export default function ProfileScreen() {
  const { displayName, username, avatarColor, pinnedDishes, ingredientData, cuisineData } =
    PROFILE;
  const s = PROFILE.stats;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarInitial}>{displayName[0]}</Text>
        </View>

        {/* Name */}
        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.username}>@{username}</Text>

        {/* Edit button */}
        <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
          <Text style={styles.editBtnText}>EDIT PROFILE</Text>
        </TouchableOpacity>

        {/* Pinned dishes */}
        <Text style={styles.sectionLabel}>PINNED DISHES</Text>
        <View style={styles.pinnedRow}>
          {pinnedDishes.map((d) => (
            <View key={d.id} style={[styles.pinnedTile, { backgroundColor: d.bg }]}>
              <Text style={styles.pinnedEmoji}>{d.emoji}</Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatItem value={s.recipesShared} label={'recipes\nshared'} />
          <StatItem value={s.fellowCooks} label={'fellow\ncooks'} />
          <StatItem value={s.dishesLogged} label={'dishes\nlogged'} />
          <StatItem value={s.badgesObtained} label={'badges\nobtained'} valueColor="#2ECC71" />
          <StatItem value={s.weekStreak} label={'week\nstreak'} valueColor="#E05252" />
        </View>

        {/* Bottom stats row */}
        <View style={styles.bottomStats}>
          <View style={styles.bottomStatBlock}>
            <Text style={styles.sectionLabel}>MOST USED{'\n'}INGREDIENT</Text>
            <IngredientEmoji data={ingredientData} />
          </View>
          <View style={styles.bottomStatBlock}>
            <Text style={styles.sectionLabel}>MOST COOKED{'\n'}CUISINE</Text>
            <CuisineFlags data={cuisineData} />
          </View>
        </View>

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
  content: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarInitial: {
    fontFamily: Font.pixel,
    fontSize: 48,
    color: '#fff',
  },
  displayName: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xl,
    color: '#000',
    marginBottom: 4,
  },
  username: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#888',
    marginBottom: 16,
  },
  editBtn: {
    borderWidth: 1.5,
    borderColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 28,
  },
  editBtnText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#000',
    letterSpacing: 0.5,
  },
  sectionLabel: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#000',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 24,
  },
  pinnedRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  pinnedTile: {
    width: 100,
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinnedEmoji: {
    fontSize: 44,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 32,
  },
  bottomStats: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  bottomStatBlock: {
    alignItems: 'center',
  },
  footer: {
    height: 24,
  },
});

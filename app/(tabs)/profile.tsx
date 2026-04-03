import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Font, FontSize } from '@/constants/theme';
import INGREDIENT_IMAGES from '@/constants/ingredientImages';
import { CircleCountryFlag, type CountryCode } from 'react-native-circle-flags';
import DishModal, { type DishEntry } from '@/components/DishModal';
import { useApi } from '@/hooks/useApi';
import { getProfile, type ApiProfile, type ApiDish } from '@/services/api';

// ── Cuisine flags ─────────────────────────────────────────────────────────────

function CuisineFlags({ data }: { data: ApiProfile['cuisineData'] }) {
  const [open, setOpen] = useState(false);
  const sorted = [...data].sort((a, b) => b.pct - a.pct);
  const top = sorted[0];

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.7}>
        <CircleCountryFlag code={top.countryCode as CountryCode} size={64} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={flags.backdrop} onPress={() => setOpen(false)}>
          <View style={flags.card}>
            <Text style={flags.cardTitle}>TOP CUISINES</Text>
            {sorted.map((item, i) => (
              <View key={item.label} style={flags.row}>
                <Text style={flags.rank}>{i + 1}</Text>
                <CircleCountryFlag code={item.countryCode as CountryCode} size={36} />
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
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 24, width: 240, gap: 12 },
  cardTitle: { fontFamily: Font.pixel, fontSize: FontSize.xl, color: '#000', letterSpacing: 0.5, marginBottom: 4, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rank: { fontFamily: Font.pixel, fontSize: FontSize.xl, color: '#aaa', width: 20, textAlign: 'center' },
  label: { fontFamily: Font.pixel, fontSize: FontSize.md, color: '#000', flex: 1 },
  pct: { fontFamily: Font.pixel, fontSize: FontSize.md, color: '#888' },
});

// ── Ingredient emoji ──────────────────────────────────────────────────────────

function IngredientEmoji({ data }: { data: ApiProfile['ingredientData'] }) {
  const [open, setOpen] = useState(false);
  const sorted = [...data].sort((a, b) => b.pct - a.pct);
  const top = sorted[0];

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.7}>
        {INGREDIENT_IMAGES[top.label?.toLowerCase().replace(' ', '_')]
          ? <Image source={INGREDIENT_IMAGES[top.label?.toLowerCase().replace(' ', '_')]} style={ingr.image} resizeMode="contain" />
          : <Text style={ingr.emoji}>{top.emoji}</Text>}
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={ingr.backdrop} onPress={() => setOpen(false)}>
          <View style={ingr.card}>
            <Text style={ingr.cardTitle}>TOP INGREDIENTS</Text>
            {sorted.map((item, i) => {
              const key = item.label?.toLowerCase().replace(' ', '_');
              return (
                <View key={item.label} style={ingr.row}>
                  <Text style={ingr.rank}>{i + 1}</Text>
                  {INGREDIENT_IMAGES[key]
                    ? <Image source={INGREDIENT_IMAGES[key]} style={ingr.imageSm} resizeMode="contain" />
                    : <Text style={ingr.emojiSm}>{item.emoji}</Text>}
                  <Text style={ingr.label}>{item.label.toUpperCase()}</Text>
                  <Text style={ingr.pct}>{Math.round(item.pct * 100)}%</Text>
                </View>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const ingr = StyleSheet.create({
  emoji: { fontSize: 64 },
  image: { width: 72, height: 72 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 24, width: 240, gap: 12 },
  cardTitle: { fontFamily: Font.pixel, fontSize: FontSize.xl, color: '#000', letterSpacing: 0.5, marginBottom: 4, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rank: { fontFamily: Font.pixel, fontSize: FontSize.xl, color: '#aaa', width: 20, textAlign: 'center' },
  emojiSm: { fontSize: 36 },
  imageSm: { width: 36, height: 36 },
  label: { fontFamily: Font.pixel, fontSize: FontSize.md, color: '#000', flex: 1 },
  pct: { fontFamily: Font.pixel, fontSize: FontSize.md, color: '#888' },
});

// ── Stat item ─────────────────────────────────────────────────────────────────

function StatItem({ value, label, valueColor = '#000' }: { value: number; label: string; valueColor?: string }) {
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
  label: { fontFamily: Font.pixel, fontSize: FontSize.xs, color: '#999', textAlign: 'center', lineHeight: 18, marginTop: 2 },
});

// ── Pinned tile ───────────────────────────────────────────────────────────────

function PinnedTile({ dish }: { dish: ApiDish }) {
  const [selected, setSelected] = useState<DishEntry | null>(null);
  if (!dish.imageUrl || !dish.name) return (
    <View style={[styles.pinnedTile, { backgroundColor: dish.bg }]} />
  );
  return (
    <>
      <TouchableOpacity
        style={[styles.pinnedTile, { backgroundColor: dish.bg }]}
        activeOpacity={0.75}
        onPress={() => setSelected({ imageUrl: dish.imageUrl, name: dish.name!, cuisine: dish.cuisine, ingredients: dish.ingredients, recipe: dish.recipe })}
      >
        <Image source={{ uri: dish.imageUrl }} style={styles.pinnedImage} resizeMode="cover" />
      </TouchableOpacity>
      {selected && <DishModal dish={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { data: profile, loading } = useApi(getProfile);

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ActivityIndicator style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  const { displayName, username, avatarUrl, pinnedDishes, ingredientData, cuisineData, stats: s } = profile;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="cover" />

        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.username}>@{username}</Text>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
            <Text style={styles.editBtnText}>EDIT PROFILE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.7} onPress={() => supabase.auth.signOut()}>
            <Text style={styles.signOutBtnText}>SIGN OUT</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>PINNED DISHES</Text>
        <View style={styles.pinnedRow}>
          {pinnedDishes.map((d) => <PinnedTile key={d.id} dish={d} />)}
        </View>

        <View style={styles.statsRow}>
          <StatItem value={s.recipesShared}  label={'recipes\nshared'} />
          <StatItem value={s.dishesLogged}   label={'dishes\nlogged'} />
          <StatItem value={s.badgesObtained} label={'badges\nobtained'} valueColor="#2ECC71" />
          <StatItem value={s.weekStreak}     label={'week\nstreak'} valueColor="#E05252" />
        </View>

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
  safe: { flex: 1, backgroundColor: '#fff' },
  content: { alignItems: 'center', paddingTop: 24, paddingHorizontal: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 14 },
  displayName: { fontFamily: Font.pixel, fontSize: FontSize.xl, color: '#000', marginBottom: 4 },
  username: { fontFamily: Font.pixel, fontSize: FontSize.md, color: '#888', marginBottom: 16 },
  btnRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  editBtn: { borderWidth: 1.5, borderColor: '#000', paddingHorizontal: 24, paddingVertical: 8, borderRadius: 4 },
  editBtnText: { fontFamily: Font.pixel, fontSize: FontSize.md, color: '#000', letterSpacing: 0.5 },
  signOutBtn: { borderWidth: 1.5, borderColor: '#E05252', paddingHorizontal: 24, paddingVertical: 8, borderRadius: 4 },
  signOutBtnText: { fontFamily: Font.pixel, fontSize: FontSize.md, color: '#E05252', letterSpacing: 0.5 },
  sectionLabel: { fontFamily: Font.pixel, fontSize: FontSize.md, color: '#000', letterSpacing: 0.5, textAlign: 'center', marginBottom: 14, lineHeight: 24 },
  pinnedRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  pinnedTile: { width: 100, height: 100, borderRadius: 10, overflow: 'hidden' },
  pinnedImage: { width: '100%', height: '100%' },
  statsRow: { flexDirection: 'row', width: '100%', marginBottom: 32 },
  bottomStats: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'flex-start' },
  bottomStatBlock: { alignItems: 'center' },
  footer: { height: 24 },
});

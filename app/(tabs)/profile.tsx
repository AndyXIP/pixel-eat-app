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
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Font, FontSize } from '@/constants/theme';
import INGREDIENT_IMAGES from '@/constants/ingredientImages';
import { CircleCountryFlag, type CountryCode } from 'react-native-circle-flags';
import DishModal, { type DishEntry } from '@/components/DishModal';
import { useData } from '@/contexts/DataContext';
import { updateProfile, uploadAvatar, type ApiProfile, type ApiDish } from '@/services/api';

// ── Edit profile modal ────────────────────────────────────────────────────────

function EditProfileModal({
  current,
  onClose,
  onSaved,
}: {
  current: { displayName: string; avatarUrl: string };
  onClose: () => void;
  onSaved: (displayName: string, avatarUrl: string) => void;
}) {
  const [displayName, setDisplayName] = useState(current.displayName);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const pickAvatar = () => {
    Alert.alert('Change photo', undefined, [
      {
        text: 'Take photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Camera permission required'); return; }
          const result = await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true, aspect: [1, 1] });
          if (!result.canceled) setAvatarUri(result.assets[0].uri);
        },
      },
      {
        text: 'Choose from library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Photo library permission required'); return; }
          const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsEditing: true, aspect: [1, 1] });
          if (!result.canceled) setAvatarUri(result.assets[0].uri);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let newAvatarUrl = current.avatarUrl;
      if (avatarUri) newAvatarUrl = await uploadAvatar(avatarUri);
      await updateProfile({
        display_name: displayName.trim() || undefined,
        avatar_url: newAvatarUrl !== current.avatarUrl ? newAvatarUrl : undefined,
      });
      onSaved(displayName.trim() || current.displayName, newAvatarUrl);
      onClose();
    } catch (e: any) {
      Alert.alert('Failed to save', e.message ?? 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const previewUri = avatarUri ?? (current.avatarUrl || undefined);

  return (
    <Modal visible animationType="slide" transparent>
      <Pressable style={edit.backdrop} onPress={onClose}>
        <Pressable style={edit.card} onPress={() => {}}>
          <Text style={edit.title}>EDIT PROFILE</Text>

          <TouchableOpacity style={edit.avatarWrapper} onPress={pickAvatar} activeOpacity={0.8}>
            {previewUri
              ? <Image source={{ uri: previewUri }} style={edit.avatar} resizeMode="cover" />
              : <View style={[edit.avatar, edit.avatarPlaceholder]} />}
            <View style={edit.avatarBadge}><Text style={edit.avatarBadgeText}>CHANGE</Text></View>
          </TouchableOpacity>

          <Text style={edit.label}>DISPLAY NAME</Text>
          <TextInput
            style={edit.input}
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
            maxLength={40}
            placeholder="your name"
            placeholderTextColor="#bbb"
          />

          <TouchableOpacity style={edit.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.8}>
            {saving
              ? <ActivityIndicator color="#fff" />
              : <Text style={edit.saveBtnText}>SAVE</Text>}
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const edit = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  card: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40, alignItems: 'center' },
  title: { fontFamily: Font.pixel, fontSize: FontSize.lg, color: '#000', marginBottom: 24 },
  avatarWrapper: { marginBottom: 24, position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { backgroundColor: '#eee' },
  avatarBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#000', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  avatarBadgeText: { fontFamily: Font.pixel, fontSize: FontSize.xs, color: '#fff' },
  label: { fontFamily: Font.pixel, fontSize: FontSize.sm, color: '#999', letterSpacing: 1, alignSelf: 'flex-start', marginBottom: 8 },
  input: { width: '100%', borderWidth: 1.5, borderColor: '#eee', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontFamily: Font.pixel, fontSize: FontSize.md, color: '#000', backgroundColor: '#fafafa', marginBottom: 24 },
  saveBtn: { width: '100%', backgroundColor: '#000', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { fontFamily: Font.pixel, fontSize: FontSize.md, color: '#fff', letterSpacing: 1 },
});

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
  const { profile, loading } = useData();
  const [editOpen, setEditOpen] = useState(false);
  const [localDisplayName, setLocalDisplayName] = useState<string | null>(null);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ActivityIndicator style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  const displayName = localDisplayName ?? profile.displayName;
  const avatarUrl   = localAvatarUrl   ?? profile.avatarUrl;
  const { username, pinnedDishes, ingredientData, cuisineData, stats: s } = profile;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="cover" /> : <View style={[styles.avatar, { backgroundColor: '#eee' }]} />}

        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.username}>@{username}</Text>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.7} onPress={() => setEditOpen(true)}>
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
            {ingredientData.length > 0
              ? <IngredientEmoji data={ingredientData} />
              : <Text style={styles.emptyHint}>no data yet</Text>}
          </View>
          <View style={styles.bottomStatBlock}>
            <Text style={styles.sectionLabel}>MOST COOKED{'\n'}CUISINE</Text>
            {cuisineData.length > 0
              ? <CuisineFlags data={cuisineData} />
              : <Text style={styles.emptyHint}>no data yet</Text>}
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>

      {editOpen && (
        <EditProfileModal
          current={{ displayName, avatarUrl }}
          onClose={() => setEditOpen(false)}
          onSaved={(name, avatar) => {
            setLocalDisplayName(name);
            setLocalAvatarUrl(avatar);
          }}
        />
      )}
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
  emptyHint: { fontFamily: Font.pixel, fontSize: FontSize.xs, color: '#ccc', marginTop: 8 },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { SpriteCompositor } from '@/components/SpriteCompositor';
import { Font, FontSize } from '@/constants/theme';
import { createPost, createQuickPost, getIngredients, type ApiIngredient } from '@/services/api';

const VESSELS = ['bowl', 'plate', 'sandwich', 'wrap', 'pizza', 'soup', 'pan', 'mug'];
const VESSEL_EMOJI: Record<string, string> = {
  bowl: '🍜', plate: '🍽️', sandwich: '🥪', wrap: '🌯',
  pizza: '🍕', soup: '🥣', pan: '🍳', mug: '☕',
};

const TOPPINGS = ['egg', 'green onion', 'kimchi', 'cheese', 'avocado', 'sesame', 'chilli', 'butter'];

export default function CreatePostScreen() {
  const [vessel, setVessel] = useState('bowl');
  const [toppings, setToppings] = useState<string[]>([]);
  const [isHot, setIsHot] = useState(true);
  const [caption, setCaption] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [ingredients, setIngredients] = useState<ApiIngredient[]>([]);

  useEffect(() => {
    getIngredients().then(setIngredients).catch(() => {});
  }, []);

  const toggleTopping = (t: string) =>
    setToppings(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const pickPhoto = () => {
    Alert.alert('Add photo', undefined, [
      {
        text: 'Take photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Camera permission required'); return; }
          const result = await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true, aspect: [1, 1] });
          if (!result.canceled) setPhotoUri(result.assets[0].uri);
        },
      },
      {
        text: 'Choose from library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Photo library permission required'); return; }
          const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsEditing: true, aspect: [1, 1] });
          if (!result.canceled) setPhotoUri(result.assets[0].uri);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handlePost = async () => {
    setPosting(true);
    try {
      if (photoUri) {
        const ingredientIds = ingredients
          .filter(ing => toppings.some(t => t.toLowerCase() === ing.name.toLowerCase()))
          .map(ing => ing.id);
        await createPost({
          vesselType: vessel,
          isHot,
          caption: caption.trim() || undefined,
          ingredientIds,
          photoUri,
        });
      } else {
        await createQuickPost({ vessel_type: vessel, is_hot: isHot, caption: caption.trim() || undefined, toppings });
      }
      router.back();
    } catch (e: any) {
      Alert.alert('Failed to post', e.message ?? 'Something went wrong');
    } finally {
      setPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={posting}>
          <Text style={styles.cancel}>CANCEL</Text>
        </TouchableOpacity>
        <Text style={styles.title}>NEW POST</Text>
        <TouchableOpacity onPress={handlePost} disabled={posting} activeOpacity={0.7}>
          {posting
            ? <ActivityIndicator color="#E05252" />
            : <Text style={styles.post}>POST</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Photo / sprite preview */}
        <TouchableOpacity style={styles.photoWrapper} onPress={pickPhoto} activeOpacity={0.85}>
          {photoUri ? (
            <>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} resizeMode="cover" />
              <View style={styles.photoEditBadge}>
                <Text style={styles.photoEditText}>CHANGE</Text>
              </View>
            </>
          ) : (
            <>
              <SpriteCompositor vessel={vessel} base="rice" toppings={toppings} size={280} />
              <View style={styles.photoCta}>
                <Text style={styles.photoCtaText}>📷  ADD PHOTO</Text>
              </View>
            </>
          )}
        </TouchableOpacity>

        {/* Caption */}
        <Text style={styles.label}>CAPTION</Text>
        <TextInput
          style={styles.captionInput}
          placeholder="what did you make?"
          placeholderTextColor="#bbb"
          value={caption}
          onChangeText={setCaption}
          multiline
          maxLength={200}
        />

        {/* Vessel picker */}
        <Text style={styles.label}>VESSEL</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
          {VESSELS.map(v => (
            <TouchableOpacity
              key={v}
              style={[styles.chip, vessel === v && styles.chipActive]}
              onPress={() => setVessel(v)}
            >
              <Text style={styles.chipEmoji}>{VESSEL_EMOJI[v]}</Text>
              <Text style={[styles.chipLabel, vessel === v && styles.chipLabelActive]}>
                {v.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Toppings picker */}
        <Text style={styles.label}>TOPPINGS</Text>
        <View style={styles.toppingGrid}>
          {TOPPINGS.map(t => {
            const selected = toppings.includes(t);
            return (
              <TouchableOpacity
                key={t}
                style={[styles.toppingChip, selected && styles.toppingChipActive]}
                onPress={() => toggleTopping(t)}
              >
                <Text style={[styles.toppingText, selected && styles.toppingTextActive]}>
                  {t.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Hot / Cold toggle */}
        <Text style={styles.label}>TEMPERATURE</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, isHot && styles.toggleBtnActive]}
            onPress={() => setIsHot(true)}
          >
            <Text style={[styles.toggleText, isHot && styles.toggleTextActive]}>🔥 HOT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !isHot && styles.toggleBtnActive]}
            onPress={() => setIsHot(false)}
          >
            <Text style={[styles.toggleText, !isHot && styles.toggleTextActive]}>🧊 COLD</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  cancel: { fontFamily: Font.pixel, fontSize: FontSize.md, color: '#888' },
  title:  { fontFamily: Font.pixel, fontSize: FontSize.lg, color: '#000' },
  post:   { fontFamily: Font.pixel, fontSize: FontSize.md, color: '#E05252' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  photoWrapper: {
    alignSelf: 'center',
    width: 280,
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 28,
    backgroundColor: '#f5f5f5',
  },
  photoPreview: { width: '100%', height: '100%' },
  photoEditBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  photoEditText: { fontFamily: Font.pixel, fontSize: FontSize.xs, color: '#fff' },
  photoCta: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  photoCtaText: { fontFamily: Font.pixel, fontSize: FontSize.sm, color: '#fff' },
  label: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#999',
    letterSpacing: 1,
    marginBottom: 12,
  },
  captionInput: {
    borderWidth: 1.5,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#000',
    backgroundColor: '#fafafa',
    minHeight: 72,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  hScroll: { marginBottom: 24 },
  chip: {
    alignItems: 'center',
    marginRight: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
    minWidth: 64,
  },
  chipActive: { borderColor: '#000', backgroundColor: '#f5f5f5' },
  chipEmoji: { fontSize: 24, marginBottom: 4 },
  chipLabel: { fontFamily: Font.pixel, fontSize: FontSize.xs, color: '#aaa' },
  chipLabelActive: { color: '#000' },
  toppingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  toppingChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#eee',
  },
  toppingChipActive: { borderColor: '#E05252', backgroundColor: '#FFF0F0' },
  toppingText: { fontFamily: Font.pixel, fontSize: FontSize.sm, color: '#aaa' },
  toppingTextActive: { color: '#E05252' },
  toggleRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#eee',
    alignItems: 'center',
  },
  toggleBtnActive: { borderColor: '#000', backgroundColor: '#f5f5f5' },
  toggleText: { fontFamily: Font.pixel, fontSize: FontSize.md, color: '#aaa' },
  toggleTextActive: { color: '#000' },
});

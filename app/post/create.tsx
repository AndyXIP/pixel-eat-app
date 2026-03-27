/**
 * Post Creation Flow (modal)
 * Steps: Camera → Vessel → Base → Toppings → Garnish → Hot/Cold → Confirm
 * TODO: wire up expo-camera, step flow, and API upload
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SpriteCompositor } from '@/components/SpriteCompositor';
import { Font, FontSize } from '@/constants/theme';

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

  const toggleTopping = (t: string) => {
    setToppings((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>CANCEL</Text>
        </TouchableOpacity>
        <Text style={styles.title}>NEW POST</Text>
        <TouchableOpacity>
          <Text style={styles.post}>POST</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Live sprite preview */}
        <View style={styles.spriteWrapper}>
          <SpriteCompositor
            vessel={vessel}
            base="rice"
            toppings={toppings}
            size={280}
          />
        </View>

        {/* Vessel picker */}
        <Text style={styles.label}>VESSEL</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
          {VESSELS.map((v) => (
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
          {TOPPINGS.map((t) => {
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
  title: { fontFamily: Font.pixel, fontSize: FontSize.lg, color: '#000' },
  post: { fontFamily: Font.pixel, fontSize: FontSize.md, color: '#E05252' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  spriteWrapper: {
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 28,
  },
  label: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#999',
    letterSpacing: 1,
    marginBottom: 12,
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
  toppingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
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

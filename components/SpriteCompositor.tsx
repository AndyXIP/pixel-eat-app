/**
 * SpriteCompositor
 * Layers PNG sprite assets (vessel → base → toppings → garnish) to build
 * the pixel art dish image client-side.
 *
 * In production: replace the placeholder View with actual Image layers
 * sourced from CDN, e.g.:
 *   <Image source={{ uri: `${CDN}/vessels/${vessel}.png` }} style={StyleSheet.absoluteFill} />
 *   <Image source={{ uri: `${CDN}/bases/${base}.png` }}   style={StyleSheet.absoluteFill} />
 *   etc.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Font, FontSize } from '@/constants/theme';

type SpriteCompositorProps = {
  vessel: string;
  base: string;
  toppings: string[];
  size?: number;
  bgColor?: string;
  accentColor?: string;
};

export function SpriteCompositor({
  vessel,
  base,
  toppings,
  size,
  bgColor = '#C4956A',
  accentColor = '#8B5E3C',
}: SpriteCompositorProps) {
  const VESSEL_EMOJI: Record<string, string> = {
    bowl: '🍜', plate: '🍽️', sandwich: '🥪', wrap: '🌯',
    pizza: '🍕', soup: '🥣', pan: '🍳', mug: '☕',
  };
  const emoji = VESSEL_EMOJI[vessel] ?? '🍽️';

  const sizeStyle = size != null ? { width: size, height: size } : StyleSheet.absoluteFill;

  return (
    <View style={[styles.container, sizeStyle, { backgroundColor: bgColor }]}>
      {/* Vessel layer — replace with CDN PNG */}
      <View style={[StyleSheet.absoluteFill, styles.outerRing, { borderColor: accentColor }]} />

      {/* Base + toppings layer — replace with CDN PNGs */}
      <View style={[styles.innerCircle, { backgroundColor: accentColor }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    borderWidth: 10,
    borderRadius: 1000,
    margin: 16,
  },
  innerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  emoji: {
    fontSize: 72,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  tagText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xs,
  },
});

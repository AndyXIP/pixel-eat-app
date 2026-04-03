import React from 'react';
import { View, Text, Modal, Pressable, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Font, FontSize } from '@/constants/theme';
import { CircleCountryFlag, type CountryCode } from 'react-native-circle-flags';

export type RecipeEntry = {
  id: string;
  name: string;
  cuisine: string;
  creatorColor: string;
  creatorUsername?: string;
  creatorAvatarUrl?: string;
  lastMade: string | null;
  ingredients: string[];
  notes: string;
};

export default function RecipeModal({ recipe, onClose }: { recipe: RecipeEntry; onClose: () => void }) {
  return (
    <Modal visible animationType="slide" transparent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{recipe.name}</Text>
              {recipe.cuisine && (
                <CircleCountryFlag code={recipe.cuisine as CountryCode} size={32} />
              )}
            </View>

            <Text style={styles.sectionLabel}>INGREDIENTS</Text>
            {recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ing, i) => (
                <View key={i} style={styles.ingredientRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.ingredientText}>{ing}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.empty}>No ingredients added yet.</Text>
            )}

            <Text style={styles.sectionLabel}>NOTES & INSTRUCTIONS</Text>
            {recipe.notes ? (
              <Text style={styles.notes}>{recipe.notes}</Text>
            ) : (
              <Text style={styles.empty}>No notes added yet.</Text>
            )}
          </ScrollView>

          <View style={styles.shareBar}>
            <TouchableOpacity style={styles.shareBtn} activeOpacity={0.7}>
              <Text style={styles.shareBtnText}>SHARE RECIPE</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    maxHeight: '80%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xl,
    color: '#E05252',
    flexShrink: 1,
    marginRight: 10,
  },
  sectionLabel: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#aaa',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 16,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E05252',
  },
  ingredientText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#333',
  },
  notes: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#333',
    lineHeight: 24,
  },
  empty: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#bbb',
  },
  shareBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    paddingTop: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  shareBtn: {
    borderWidth: 1.5,
    borderColor: '#000',
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 6,
  },
  shareBtnText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#000',
    letterSpacing: 0.5,
  },
});

import React, { useState } from 'react';
import { View, Text, Image, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Font, FontSize } from '@/constants/theme';
import RecipeModal from '@/components/RecipeModal';
import { CircleCountryFlag, type CountryCode } from 'react-native-circle-flags';
import type { ApiRecipe } from '@/services/api';

export type DishEntry = {
  imageUrl: string | null;
  name: string;
  cuisine: string | null;
  ingredients: string[];
  recipe: ApiRecipe | null;
};

export default function DishModal({ dish, onClose }: { dish: DishEntry; onClose: () => void }) {
  const [recipeOpen, setRecipeOpen] = useState(false);
  const recipe = dish.recipe;

  return (
    <>
      <Modal visible animationType="fade" transparent>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable style={styles.card} onPress={() => {}}>
            <View style={styles.imageBox}>
              {dish.imageUrl ? (
                <Image source={{ uri: dish.imageUrl }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={[styles.image, { backgroundColor: '#f5f5f5' }]} />
              )}
              {dish.cuisine && (
                <View style={styles.flagBadge}>
                  <CircleCountryFlag code={dish.cuisine as CountryCode} size={36} />
                </View>
              )}
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              <Text style={styles.name}>{dish.name}</Text>

              {dish.ingredients.length > 0 && (
                <View style={styles.tagRow}>
                  {dish.ingredients.map((ing, i) => (
                    <View key={i} style={styles.tag}>
                      <Text style={styles.tagText}>{ing}</Text>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.recipeRow}
                activeOpacity={recipe ? 0.6 : 1}
                onPress={() => recipe && setRecipeOpen(true)}
              >
                <Text style={styles.recipeLabel}>RECIPE</Text>
                {recipe ? (
                  <Text style={styles.recipeName}>{recipe.name} →</Text>
                ) : (
                  <Text style={styles.recipeEmpty}>no recipe saved</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {recipeOpen && recipe && (
        <RecipeModal recipe={recipe} onClose={() => setRecipeOpen(false)} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  imageBox: {
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  body: {
    padding: 16,
  },
  flagBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  name: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xl,
    color: '#000',
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f5f5f5',
  },
  tagText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xs,
    color: '#444',
  },
  recipeRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    paddingTop: 14,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recipeLabel: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xs,
    color: '#aaa',
    letterSpacing: 1,
  },
  recipeName: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#E05252',
  },
  recipeEmpty: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#bbb',
  },
});

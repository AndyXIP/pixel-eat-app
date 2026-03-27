import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RECIPES } from '@/constants/mockData';
import { Font, FontSize } from '@/constants/theme';

type Recipe = typeof RECIPES[0];

// ── Recipe detail modal ───────────────────────────────────────────────────────

function RecipeModal({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  return (
    <Modal visible animationType="slide" transparent>
      <Pressable style={modal.backdrop} onPress={onClose}>
        <Pressable style={modal.card} onPress={() => {}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={modal.title}>{recipe.name}</Text>

            <Text style={modal.sectionLabel}>INGREDIENTS</Text>
            {recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ing, i) => (
                <View key={i} style={modal.ingredientRow}>
                  <View style={modal.bullet} />
                  <Text style={modal.ingredientText}>{ing}</Text>
                </View>
              ))
            ) : (
              <Text style={modal.empty}>No ingredients added yet.</Text>
            )}

            <Text style={modal.sectionLabel}>NOTES & INSTRUCTIONS</Text>
            {recipe.notes ? (
              <Text style={modal.notes}>{recipe.notes}</Text>
            ) : (
              <Text style={modal.empty}>No notes added yet.</Text>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const modal = StyleSheet.create({
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
  title: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xl,
    color: '#E05252',
    marginBottom: 20,
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
});

// ── Swipeable recipe row ──────────────────────────────────────────────────────

const SWIPE_THRESHOLD = 60;
const DELETE_BTN_WIDTH = 70;

function SwipeableRow({
  item,
  onPress,
  onDelete,
}: {
  item: Recipe;
  onPress: () => void;
  onDelete: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const hasDate = !!item.lastMade;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dy) < 12,
      onPanResponderMove: (_, g) => {
        const x = Math.min(0, Math.max(-DELETE_BTN_WIDTH, g.dx));
        translateX.setValue(x);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx < -SWIPE_THRESHOLD) {
          Animated.spring(translateX, { toValue: -DELETE_BTN_WIDTH, useNativeDriver: true }).start();
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const close = () =>
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();

  return (
    <View style={swipe.wrapper}>
      {/* Delete button revealed behind */}
      <View style={swipe.deleteBtn}>
        <TouchableOpacity onPress={() => { close(); onDelete(); }} style={swipe.deleteTap}>
          <Text style={swipe.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </View>

      {/* Row content */}
      <Animated.View style={{ transform: [{ translateX }] }} {...panResponder.panHandlers}>
        <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={onPress}>
          <Text style={[styles.recipeName, !hasDate && styles.recipeNameFaint]} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={[styles.creatorDot, { backgroundColor: item.creatorColor }]} />
          <Text style={[styles.lastMade, !hasDate && styles.lastMadeFaint]}>
            {item.lastMade ?? '- -'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const swipe = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  deleteBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DELETE_BTN_WIDTH,
    backgroundColor: '#E05252',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteTap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  deleteIcon: {
    fontSize: 22,
  },
});

// ── Main screen ───────────────────────────────────────────────────────────────

export default function RecipeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>(RECIPES);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Recipe | null>(null);

  const q = query.toLowerCase();
  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(q) ||
    r.ingredients.some((ing) => ing.toLowerCase().includes(q))
  );

  const deleteRecipe = (id: string) =>
    setRecipes((prev) => prev.filter((r) => r.id !== id));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Search bar + add button */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="search recipes..."
          placeholderTextColor="#bbb"
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.7}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Column headers */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerLabel, { flex: 1 }]}>dish name</Text>
        <Text style={styles.headerLabel}>creator</Text>
        <Text style={[styles.headerLabel, styles.headerRight]}>last made</Text>
      </View>
      <View style={styles.divider} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.map((item) => (
          <SwipeableRow
            key={item.id}
            item={item}
            onPress={() => setSelected(item)}
            onDelete={() => deleteRecipe(item.id)}
          />
        ))}
        <View style={styles.footer} />
      </ScrollView>

      {selected && (
        <RecipeModal recipe={selected} onClose={() => setSelected(null)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1.5,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#000',
    backgroundColor: '#fafafa',
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerLabel: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#999',
    letterSpacing: 0.3,
  },
  headerRight: {
    textAlign: 'right',
    minWidth: 90,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee',
    marginHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  recipeName: {
    flex: 1,
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#E05252',
    marginRight: 12,
    letterSpacing: 0.3,
  },
  recipeNameFaint: {
    opacity: 0.45,
  },
  creatorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
  },
  lastMade: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#555',
    minWidth: 90,
    textAlign: 'right',
  },
  lastMadeFaint: {
    color: '#bbb',
  },
  footer: {
    height: 24,
  },
});

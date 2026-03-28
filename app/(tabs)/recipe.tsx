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
  FlatList,
  Animated,
  PanResponder,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RECIPES } from '@/constants/mockData';
import { Font, FontSize } from '@/constants/theme';
import MOCK_PROFILE_IMAGES from '@/constants/mockProfileImages';
import RecipeModal, { type RecipeEntry } from '@/components/RecipeModal';
import { CircleCountryFlag, type CountryCode } from 'react-native-circle-flags';

const PROFILE_KEYS = Object.keys(MOCK_PROFILE_IMAGES);

const CUISINE_OPTIONS: { code: string; label: string }[] = [
  { code: 'tw', label: 'Taiwanese' },
  { code: 'cn', label: 'Chinese' },
  { code: 'jp', label: 'Japanese' },
  { code: 'kr', label: 'Korean' },
  { code: 'th', label: 'Thai' },
  { code: 'vn', label: 'Vietnamese' },
  { code: 'in', label: 'Indian' },
  { code: 'it', label: 'Italian' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'mx', label: 'Mexican' },
  { code: 'us', label: 'American' },
  { code: 'gb', label: 'British' },
  { code: 'ae', label: 'Middle Eastern' },
];

type Recipe = RecipeEntry;

// ── Add recipe modal ──────────────────────────────────────────────────────────

function AddRecipeModal({ onClose, onSave }: { onClose: () => void; onSave: (r: Recipe) => void }) {
  const [name, setName] = useState('');
  const [ingInput, setIngInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [cuisine, setCuisine] = useState<string | null>(null);

  const addIngredient = () => {
    const trimmed = ingInput.trim().toLowerCase();
    if (!trimmed) return;
    setIngredients(prev => [...prev, trimmed]);
    setIngInput('');
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: `r${Date.now()}`,
      name: name.trim().toUpperCase(),
      cuisine: cuisine ?? 'xx',
      creatorColor: '#5A6E7F',
      creatorUsername: 'secondapron',
      lastMade: null,
      ingredients,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <Modal visible animationType="slide" transparent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={add.backdrop} onPress={onClose}>
          <Pressable style={add.card} onPress={() => {}}>
            <Text style={add.title}>NEW RECIPE</Text>

            {/* Name */}
            <Text style={add.label}>DISH NAME</Text>
            <TextInput
              style={add.input}
              placeholder="e.g. Braised Pork Rice"
              placeholderTextColor="#bbb"
              value={name}
              onChangeText={setName}
              autoCapitalize="characters"
            />

            {/* Ingredients */}
            <Text style={add.label}>INGREDIENTS</Text>
            <View style={add.ingRow}>
              <TextInput
                style={[add.input, { flex: 1 }]}
                placeholder="e.g. spring onion"
                placeholderTextColor="#bbb"
                value={ingInput}
                onChangeText={setIngInput}
                onSubmitEditing={addIngredient}
                returnKeyType="done"
                blurOnSubmit={false}
              />
              <TouchableOpacity style={add.ingAddBtn} onPress={addIngredient} activeOpacity={0.7}>
                <Text style={add.ingAddBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            {ingredients.length > 0 && (
              <View style={add.ingList}>
                {ingredients.map((ing, i) => (
                  <TouchableOpacity key={i} style={add.ingTag} onPress={() => setIngredients(prev => prev.filter((_, idx) => idx !== i))} activeOpacity={0.7}>
                    <Text style={add.ingTagText}>{ing}</Text>
                    <Text style={add.ingTagRemove}>×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Notes */}
            <Text style={add.label}>NOTES & INSTRUCTIONS</Text>
            <TextInput
              style={[add.input, add.notesInput]}
              placeholder="Method, tips, variations..."
              placeholderTextColor="#bbb"
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
            />

            {/* Cuisine */}
            <Text style={add.label}>CUISINE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={add.cuisineScroll}>
              {CUISINE_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.code}
                  style={[add.cuisineOpt, cuisine === opt.code && add.cuisineOptSelected]}
                  onPress={() => setCuisine(prev => prev === opt.code ? null : opt.code)}
                  activeOpacity={0.7}
                >
                  <CircleCountryFlag code={opt.code as CountryCode} size={28} />
                  <Text style={[add.cuisineLabel, cuisine === opt.code && add.cuisineLabelSelected]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Creator */}
            <View style={add.creatorRow}>
              <Image source={MOCK_PROFILE_IMAGES['secondapron']} style={add.creatorAvatar} resizeMode="cover" />
              <Text style={add.creatorLabel}>added by you</Text>
            </View>

            {/* Actions */}
            <View style={add.actions}>
              <TouchableOpacity style={[add.btn, add.btnCancel]} onPress={onClose} activeOpacity={0.7}>
                <Text style={[add.btnText, add.btnTextCancel]}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[add.btn, add.btnSave, !name.trim() && add.btnDisabled]} onPress={handleSave} activeOpacity={0.7}>
                <Text style={add.btnText}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const add = StyleSheet.create({
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
    paddingBottom: 32,
  },
  title: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xl,
    color: '#000',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#aaa',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#000',
    backgroundColor: '#fafafa',
  },
  ingRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  ingAddBtn: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingAddBtnText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 28,
  },
  ingList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  ingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f5f5f5',
    gap: 6,
  },
  ingTagText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xs,
    color: '#333',
  },
  ingTagRemove: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#bbb',
    lineHeight: 18,
  },
  notesInput: {
    height: 90,
    paddingTop: 10,
  },
  cuisineScroll: {
    marginBottom: 4,
  },
  cuisineOpt: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#eee',
    marginRight: 8,
    gap: 4,
  },
  cuisineOptSelected: {
    borderColor: '#000',
    backgroundColor: '#f5f5f5',
  },
  cuisineLabel: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xs,
    color: '#aaa',
  },
  cuisineLabelSelected: {
    color: '#000',
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
  },
  creatorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  creatorLabel: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#aaa',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCancel: {
    borderWidth: 1.5,
    borderColor: '#ddd',
  },
  btnSave: {
    backgroundColor: '#000',
  },
  btnDisabled: {
    opacity: 0.35,
  },
  btnText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#fff',
    letterSpacing: 0.5,
  },
  btnTextCancel: {
    color: '#555',
  },
});

// ── Swipeable recipe row ──────────────────────────────────────────────────────

const SWIPE_THRESHOLD = 60;
const DELETE_BTN_WIDTH = 70;

function SwipeableRow({
  item,
  index,
  onPress,
  onDelete,
}: {
  item: Recipe;
  index: number;
  onPress: () => void;
  onDelete: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);
  const hasDate = !!item.lastMade;
  const avatarSource = item.creatorUsername
    ? MOCK_PROFILE_IMAGES[item.creatorUsername]
    : MOCK_PROFILE_IMAGES[PROFILE_KEYS[index % PROFILE_KEYS.length]];

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
          setIsOpen(true);
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
          setIsOpen(false);
        }
      },
    })
  ).current;

  const close = () => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
    setIsOpen(false);
  };

  return (
    <View style={swipe.wrapper}>
      {/* Delete button — only rendered when row is open to prevent opacity flash on tap */}
      {isOpen && (
        <View style={swipe.deleteBtn}>
          <TouchableOpacity onPress={() => { close(); onDelete(); }} style={swipe.deleteTap}>
            <Text style={swipe.deleteIcon}>🗑</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Row content */}
      <Animated.View style={{ transform: [{ translateX }] }} {...panResponder.panHandlers}>
        <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={onPress}>
          {item.cuisine ? (
            <CircleCountryFlag code={item.cuisine as CountryCode} size={20} style={styles.rowFlag} />
          ) : (
            <View style={styles.rowFlagPlaceholder} />
          )}
          <Text style={[styles.recipeName, !hasDate && styles.recipeNameFaint]} numberOfLines={1}>
            {item.name}
          </Text>
          <Image source={avatarSource} style={styles.creatorDot} resizeMode="cover" />
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
  const [recipes, setRecipes] = useState<Recipe[]>(RECIPES as Recipe[]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [addOpen, setAddOpen] = useState(false);

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
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.7} onPress={() => setAddOpen(true)}>
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
        {filtered.map((item, i) => (
          <SwipeableRow
            key={item.id}
            item={item}
            index={i}
            onPress={() => setSelected(item)}
            onDelete={() => deleteRecipe(item.id)}
          />
        ))}
        <View style={styles.footer} />
      </ScrollView>

      {selected && (
        <RecipeModal recipe={selected} onClose={() => setSelected(null)} />
      )}

      {addOpen && (
        <AddRecipeModal
          onClose={() => setAddOpen(false)}
          onSave={(r) => setRecipes(prev => [r, ...prev])}
        />
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
  rowFlag: {
    marginRight: 8,
  },
  rowFlagPlaceholder: {
    width: 20,
    height: 20,
    marginRight: 8,
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
    overflow: 'hidden',
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

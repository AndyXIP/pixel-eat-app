import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Font, FontSize } from '@/constants/theme';
import INGREDIENT_IMAGES from '@/constants/ingredientImages';
import DishModal, { type DishEntry } from '@/components/DishModal';
import { useData } from '@/contexts/DataContext';
import { type ApiDiary, type ApiDish, type ApiLoggedDay } from '@/services/api';
import { apiImageUrl } from '@/constants/api';

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// ── Day modal ─────────────────────────────────────────────────────────────────

function DayModal({ entry, onClose }: { entry: ApiLoggedDay; onClose: () => void }) {
  return (
    <Modal visible animationType="fade" transparent>
      <Pressable style={dayModal.backdrop} onPress={onClose}>
        <Pressable style={dayModal.card} onPress={() => {}}>
          <View style={dayModal.imageBox}>
            {entry.photoUrl ? (
              <Image source={{ uri: entry.photoUrl }} style={dayModal.photo} resizeMode="cover" />
            ) : (
              <View style={dayModal.noPhoto}>
                <Image
                  source={{ uri: apiImageUrl('mockimages/pan.png') }}
                  style={dayModal.panLarge}
                  resizeMode="contain"
                />
                <Text style={dayModal.noPhotoText}>no photo for this day</Text>
              </View>
            )}
          </View>
          {entry.caption && (
            <Text style={dayModal.caption}>{entry.caption}</Text>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const dayModal = StyleSheet.create({
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
  },
  imageBox: {
    width: '100%',
    aspectRatio: 1,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  noPhoto: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    gap: 12,
  },
  panLarge: {
    width: 80,
    height: 80,
    opacity: 0.4,
  },
  noPhotoText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#aaa',
  },
  caption: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#333',
    padding: 16,
  },
});

// ── Calendar grid ─────────────────────────────────────────────────────────────

function CalendarGrid({
  year,
  monthIndex,
  loggedDays,
}: {
  year: number;
  monthIndex: number;
  loggedDays: ApiLoggedDay[];
}) {
  const [selected, setSelected] = useState<ApiLoggedDay | null>(null);
  const loggedMap = new Map(loggedDays.map(e => [e.day, e]));
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <>
      <View style={cal.wrapper}>
        <View style={cal.row}>
          {WEEK_DAYS.map((d, i) => (
            <Text key={i} style={cal.header}>{d}</Text>
          ))}
        </View>
        {weeks.map((week, wi) => (
          <View key={wi} style={cal.row}>
            {week.map((day, di) => {
              const entry = day !== null ? loggedMap.get(day) : undefined;
              return (
                <TouchableOpacity
                  key={di}
                  style={cal.cell}
                  activeOpacity={entry ? 0.6 : 1}
                  onPress={() => entry && setSelected(entry)}
                >
                  {day !== null && (
                    <>
                      <Text style={cal.dayNum}>{day}</Text>
                      {entry && (
                        <Image
                          source={{ uri: apiImageUrl('mockimages/pan.png') }}
                          style={cal.panIcon}
                          resizeMode="contain"
                        />
                      )}
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {selected && (
        <DayModal entry={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

const cal = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    flex: 1,
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayNum: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xs,
    color: '#333',
  },
  panIcon: {
    width: 22,
    height: 22,
  },
});

// ── Diary stats ───────────────────────────────────────────────────────────────

function DiaryStats({ s }: { s: ApiDiary['stats'] }) {
  return (
    <View style={dStats.row}>
      <StatBlock value={s.recipesShared} label={'recipes\nshared'} />
      <StatBlock value={s.dishesLogged} label={'dishes\nlogged'} />
      <StatBlock value={s.newRecipes} label={'new\nrecipes'} color="#2ECC71" />
      <StatBlock value={s.challengeRecipes} label={'challenge\nrecipes'} color="#3498DB" />
      <StatBlock value={s.dayStreak} label={'day\nstreak'} color="#E05252" />
    </View>
  );
}

function StatBlock({ value, label, color = '#000' }: { value: number; label: string; color?: string }) {
  return (
    <View style={dStats.item}>
      <Text style={[dStats.value, { color }]}>{value}</Text>
      <Text style={dStats.label}>{label}</Text>
    </View>
  );
}

const dStats = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 28,
  },
  item: { flex: 1, alignItems: 'center' },
  value: {
    fontFamily: Font.pixel,
    fontSize: FontSize.stat,
    color: '#000',
  },
  label: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xs,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 2,
  },
});

// ── Challenge modal ───────────────────────────────────────────────────────────

type ChallengeDetail = NonNullable<ApiDiary['challengeDetail']>;

function ChallengeModal({
  visible,
  onClose,
  title,
  detail,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  detail: ChallengeDetail;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={cm.backdrop} onPress={onClose}>
        <Pressable style={cm.card} onPress={() => {}}>
          <Text style={cm.title}>{title}</Text>
          <Text style={cm.body}>{detail.description}</Text>
          <View style={cm.ingredientGrid}>
            {detail.ingredients.map((ing) => (
              <View key={ing.label} style={cm.ingredientItem}>
                <Image source={INGREDIENT_IMAGES[ing.imageKey]} style={cm.ingredientImage} resizeMode="contain" />
                <Text style={cm.ingredientLabel}>{ing.label}</Text>
              </View>
            ))}
          </View>
          {detail.featuredRecipes.map((r) => (
            <Text key={r} style={cm.recipe}>{r}</Text>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const cm = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
  },
  title: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xl,
    color: '#E05252',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 16,
  },
  body: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#333',
    lineHeight: 22,
    marginBottom: 14,
  },
  ingredientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  ingredientItem: {
    width: '30%',
    alignItems: 'center',
    gap: 4,
  },
  ingredientImage: {
    width: 64,
    height: 64,
  },
  ingredientLabel: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xs,
    color: '#555',
    textAlign: 'center',
  },
  recipe: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#E05252',
    marginBottom: 8,
  },
});

// ── Lantern ───────────────────────────────────────────────────────────────────

function Lantern({ filled }: { filled: boolean }) {
  return (
    <View style={[styles.lantern, filled ? styles.lanternFilled : styles.lanternEmpty]}>
      <Image
        source={filled ? require('@/assets/images/latern.png') : require('@/assets/images/lantern_bw.png')}
        style={styles.lanternEmoji}
        resizeMode="contain"
      />
    </View>
  );
}

// ── Dish tile ─────────────────────────────────────────────────────────────────

function DishTile({ item }: { item: ApiDish }) {
  const [selected, setSelected] = useState<DishEntry | null>(null);
  const isEmpty = !item.imageUrl;

  const handlePress = () => {
    if (!item.imageUrl || !item.name) return;
    setSelected({
      imageUrl: item.imageUrl,
      name: item.name,
      cuisine: item.cuisine,
      ingredients: item.ingredients,
      recipe: item.recipe,
    });
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.dishTile, { backgroundColor: item.bg }, isEmpty && styles.dishTileEmpty]}
        activeOpacity={isEmpty ? 1 : 0.75}
        onPress={handlePress}
      >
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.dishImage} resizeMode="cover" />
        ) : null}
      </TouchableOpacity>
      {selected && <DishModal dish={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function DiaryScreen() {
  const { diary, loading } = useData();
  const [tab, setTab] = useState<'diary' | 'events'>('diary');
  const [challengeOpen, setChallengeOpen] = useState(false);

  if (loading || !diary) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ActivityIndicator style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  const { month, year, monthIndex, loggedDays, stats, challengeTitle, challengeDetail, lanternProgress, dishesThisWeek } = diary;
  const { filled, total, mealsUntilBadge } = lanternProgress;
  const hasEvent = !!challengeTitle;

  const lanterns = Array.from({ length: total }, (_, i) => i < filled);
  const topRow = lanterns.slice(0, 5);
  const bottomRow = lanterns.slice(5, 10);

  const dishRows: ApiDish[][] = [];
  for (let i = 0; i < dishesThisWeek.length; i += 3) {
    dishRows.push(dishesThisWeek.slice(i, i + 3));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Tab switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'diary' && styles.tabBtnActive]}
          onPress={() => setTab('diary')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabBtnText, tab === 'diary' && styles.tabBtnTextActive]}>DIARY</Text>
        </TouchableOpacity>
        {hasEvent && (
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'events' && styles.tabBtnActive]}
            onPress={() => setTab('events')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabBtnText, tab === 'events' && styles.tabBtnTextActive]}>EVENTS</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {tab === 'diary' ? (
          <>
            <Text style={styles.month}>{month}</Text>
            <CalendarGrid year={year} monthIndex={monthIndex} loggedDays={loggedDays} />
            <DiaryStats s={stats} />
            <Text style={styles.sectionLabel}>DISHES THIS WEEK</Text>
            <View style={styles.dishGrid}>
              {dishRows.map((row, ri) => (
                <View key={ri} style={styles.dishRow}>
                  {row.map((item) => (
                    <DishTile key={item.id} item={item} />
                  ))}
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.challengeTitle}>{challengeTitle}</Text>

            <TouchableOpacity style={styles.duckContainer} onPress={() => setChallengeOpen(true)} activeOpacity={0.7}>
              <Image source={require('@/assets/images/lucky_duck.png')} style={styles.duckBig} resizeMode="contain" />
            </TouchableOpacity>

            {challengeDetail && (
              <ChallengeModal
                visible={challengeOpen}
                onClose={() => setChallengeOpen(false)}
                title={challengeTitle!}
                detail={challengeDetail}
              />
            )}

            <Text style={styles.sectionLabel}>CHALLENGE PROGRESS</Text>
            <View style={styles.lanternGrid}>
              <View style={styles.lanternRow}>
                {topRow.map((f, i) => <Lantern key={`t${i}`} filled={f} />)}
              </View>
              <View style={styles.lanternRow}>
                {bottomRow.map((f, i) => <Lantern key={`b${i}`} filled={f} />)}
              </View>
            </View>

            <Text style={styles.badgeLabel}>MEALS UNTIL BADGE: {mealsUntilBadge}</Text>
          </>
        )}

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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 20,
  },
  tabBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#000',
  },
  tabBtnText: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#aaa',
    letterSpacing: 0.5,
  },
  tabBtnTextActive: {
    color: '#000',
  },
  content: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  month: {
    fontFamily: Font.pixel,
    fontSize: FontSize.lg,
    color: '#000',
    marginBottom: 12,
    letterSpacing: 1,
  },
  challengeTitle: {
    fontFamily: Font.pixel,
    fontSize: FontSize.xl,
    color: '#E05252',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  duckContainer: {
    marginBottom: 16,
  },
  duckBig: {
    width: 100,
    height: 100,
  },
  sectionLabel: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#000',
    letterSpacing: 1,
    marginBottom: 16,
    marginTop: 8,
  },
  lanternGrid: {
    marginBottom: 16,
    gap: 8,
  },
  lanternRow: {
    flexDirection: 'row',
    gap: 10,
  },
  lantern: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lanternFilled: {
    backgroundColor: 'transparent',
  },
  lanternEmpty: {
    backgroundColor: 'transparent',
    opacity: 0.35,
  },
  lanternEmoji: {
    width: 36,
    height: 36,
  },
  badgeLabel: {
    fontFamily: Font.pixel,
    fontSize: FontSize.md,
    color: '#000',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  dishGrid: {
    width: '100%',
    gap: 10,
  },
  dishRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dishTile: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dishTileEmpty: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  footer: {
    height: 24,
  },
});

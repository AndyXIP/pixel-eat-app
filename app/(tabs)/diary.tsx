import React, { useState } from 'react';
import {
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
import { DIARY } from '@/constants/mockData';
import { Font, FontSize } from '@/constants/theme';

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function CalendarGrid({
  year,
  monthIndex,
  loggedDays,
}: {
  year: number;
  monthIndex: number;
  loggedDays: number[];
}) {
  const loggedSet = new Set(loggedDays);
  const firstDay = new Date(year, monthIndex, 1).getDay(); // 0=Sun
  // Convert to Mon-based index (Mon=0 … Sun=6)
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Build flat cell array (nulls for leading blanks)
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <View style={cal.wrapper}>
      {/* Day headers */}
      <View style={cal.row}>
        {WEEK_DAYS.map((d, i) => (
          <Text key={i} style={cal.header}>{d}</Text>
        ))}
      </View>
      {weeks.map((week, wi) => (
        <View key={wi} style={cal.row}>
          {week.map((day, di) => (
            <View key={di} style={cal.cell}>
              {day !== null && (
                <>
                  <Text style={cal.dayNum}>{day}</Text>
                  {loggedSet.has(day) && <Text style={cal.mealEmoji}>🍳</Text>}
                </>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
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
  mealEmoji: {
    fontSize: 18,
  },
});

function DiaryStats({ s }: { s: typeof DIARY.stats }) {
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

function ChallengeModal({
  visible,
  onClose,
  title,
  detail,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  detail: typeof DIARY.challengeDetail;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={cm.backdrop} onPress={onClose}>
        <Pressable style={cm.card} onPress={() => {}}>
          <Text style={cm.title}>{title}</Text>
          <Text style={cm.body}>{detail.description}</Text>
          <Text style={cm.prompt}>{detail.loggingPrompt}</Text>
          <View style={cm.ingredientGrid}>
            {detail.ingredients.map((ing) => (
              <View key={ing.label} style={cm.ingredientItem}>
                <Text style={cm.ingredientEmoji}>{ing.emoji}</Text>
                <Text style={cm.ingredientLabel}>{ing.label}</Text>
              </View>
            ))}
          </View>
          <Text style={cm.prompt}>{detail.recipePrompt}</Text>
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
  prompt: {
    fontFamily: Font.pixel,
    fontSize: FontSize.sm,
    color: '#333',
    marginBottom: 14,
    lineHeight: 22,
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
  ingredientEmoji: {
    fontSize: 48,
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

function DishTile({ item }: { item: typeof DIARY.dishesThisWeek[0] }) {
  const isEmpty = !item.emoji;
  return (
    <View style={[styles.dishTile, { backgroundColor: item.bg }, isEmpty && styles.dishTileEmpty]}>
      {item.emoji ? (
        <Text style={styles.dishEmoji}>{item.emoji}</Text>
      ) : null}
    </View>
  );
}

const hasEvent = !!DIARY.challengeTitle;

export default function DiaryScreen() {
  const { month, year, monthIndex, loggedDays, stats, challengeTitle, challengeDetail, progress, total, mealsUntilBadge, dishesThisWeek } = DIARY;
  const [tab, setTab] = useState<'diary' | 'events'>('diary');
  const [challengeOpen, setChallengeOpen] = useState(false);

  const lanterns = Array.from({ length: total }, (_, i) => i < progress);
  const topRow = lanterns.slice(0, 5);
  const bottomRow = lanterns.slice(5, 10);

  const dishRows: typeof dishesThisWeek[] = [];
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

            <ChallengeModal
              visible={challengeOpen}
              onClose={() => setChallengeOpen(false)}
              title={challengeTitle}
              detail={challengeDetail}
            />

            <Text style={styles.sectionLabel}>CHALLENGE DETAILS</Text>
            <View style={styles.lanternGrid}>
              <View style={styles.lanternRow}>
                {topRow.map((filled, i) => <Lantern key={`t${i}`} filled={filled} />)}
              </View>
              <View style={styles.lanternRow}>
                {bottomRow.map((filled, i) => <Lantern key={`b${i}`} filled={filled} />)}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  dishTileEmpty: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
  },
  dishEmoji: {
    fontSize: 40,
  },
  footer: {
    height: 24,
  },
});

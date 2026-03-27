export const FEED_POSTS = [
  {
    id: '1',
    user: {
      id: 'u1',
      displayName: 'grep 🍇',
      username: 'putao_doggo',
      avatarColor: '#8B6F47',
    },
    date: 'February 7th',
    caption: 'very dirty latte for my runner bf <3',
    timeAgo: '2 mins ago',
    ingredients: { vessel: 'mug', base: 'espresso', toppings: ['milk foam', 'latte art'] },
    spriteColors: { bg: '#C4956A', accent: '#8B5E3C' },
    isHot: true,
  },
  {
    id: '2',
    user: {
      id: 'u2',
      displayName: 'hyems',
      username: 'heymin',
      avatarColor: '#6B8CAE',
    },
    date: 'February 6th',
    caption: 'sundubu jjigae for the soul',
    timeAgo: '1 day ago',
    ingredients: { vessel: 'bowl', base: 'tofu', toppings: ['kimchi', 'egg', 'green onion'] },
    spriteColors: { bg: '#E8604C', accent: '#C0392B' },
    isHot: true,
  },
  {
    id: '3',
    user: {
      id: 'u3',
      displayName: 'Leo Chang',
      username: 'secondapron',
      avatarColor: '#5A6E7F',
    },
    date: 'February 5th',
    caption: 'luroufan from scratch, 4 hour braise 🤤',
    timeAgo: '2 days ago',
    ingredients: { vessel: 'bowl', base: 'rice', toppings: ['braised pork', 'egg', 'pickled radish'] },
    spriteColors: { bg: '#8B5E3C', accent: '#F0C27F' },
    isHot: false,
  },
];

export const PROFILE = {
  displayName: 'Leo Chang',
  username: 'secondapron',
  avatarColor: '#5A6E7F',
  stats: {
    recipesShared: 3,
    fellowCooks: 12,
    dishesLogged: 39,
    badgesObtained: 4,
    weekStreak: 2,
  },
  pinnedDishes: [
    { id: 'd1', bg: '#6B5B95', emoji: '🍱' },
    { id: 'd2', bg: '#C0392B', emoji: '🍲' },
    { id: 'd3', bg: '#F8C8D4', emoji: '🍰' },
  ],
  ingredientData: [
    { emoji: '🧅', label: 'Green Onion', pct: 0.48 },
    { emoji: '🧄', label: 'Garlic', pct: 0.31 },
    { emoji: '🫚', label: 'Sesame Oil', pct: 0.21 },
  ],
  cuisineData: [
    { label: 'Taiwanese', flag: '🇹🇼', pct: 0.55 },
    { label: 'Korean', flag: '🇰🇷', pct: 0.30 },
    { label: 'Other', flag: '🌍', pct: 0.15 },
  ],
};

export const RECIPES = [
  { id: 'r1', name: 'LUROUFAN', creatorColor: '#5A6E7F', lastMade: '2 days ago', ingredients: ['pork belly', 'soy sauce', 'five spice', 'rice', 'egg'], notes: 'Braise the pork for at least 3 hours on low heat. The fat should be melt-in-your-mouth. Serve over steamed white rice with a soft-boiled soy egg.' },
  { id: 'r2', name: 'CANTONESE STEAMED CHICKEN', creatorColor: '#8B6F47', lastMade: 'Jan 20th, 2026', ingredients: ['whole chicken', 'ginger', 'spring onion', 'soy sauce', 'sesame oil'], notes: 'Steam for 20 min then rest 10 min before cutting. Use the steaming juices as a sauce base.' },
  { id: 'r3', name: 'BEEF NOODLE SOUP', creatorColor: '#6B8CAE', lastMade: 'Dec 4th, 2025', ingredients: ['beef shank', 'noodles', 'doubanjiang', 'tomato', 'star anise', 'soy sauce'], notes: '' },
  { id: 'r4', name: 'BREAKFAST BURRITOS', creatorColor: '#C0392B', lastMade: '5 days ago', ingredients: ['flour tortilla', 'eggs', 'cheddar', 'salsa', 'black beans', 'avocado'], notes: 'Scramble eggs low and slow. Warm tortilla on dry pan before filling.' },
  { id: 'r5', name: 'DUCK WITH PLUM SAUCE', creatorColor: '#5A6E7F', lastMade: 'Dec 25th, 2025', ingredients: ['duck legs', 'plums', 'star anise', 'honey', 'rice vinegar'], notes: '' },
  { id: 'r6', name: 'CENTURY EGG PESTO TOFU', creatorColor: '#8B5E3C', lastMade: 'Jan 2nd, 2025', ingredients: ['silken tofu', 'century egg', 'basil pesto', 'spring onion', 'sesame oil'], notes: 'A fusion experiment. Chill everything before plating.' },
  { id: 'r7', name: "PENG'S SPECIAL TOMATO AND EGG", creatorColor: '#6B5B95', lastMade: null, ingredients: ['tomatoes', 'eggs', 'spring onion', 'sugar', 'soy sauce'], notes: '' },
  { id: 'r8', name: 'BURNT BASQUE CHEESECAKE', creatorColor: '#8B6F47', lastMade: '3 days ago', ingredients: ['cream cheese', 'eggs', 'heavy cream', 'sugar', 'flour'], notes: 'Bake at 220°C for 50 min. It should look burnt on top — that is correct.' },
  { id: 'r9', name: 'COFFEE WALNUT LOAF', creatorColor: '#5A6E7F', lastMade: null, ingredients: ['flour', 'walnuts', 'espresso', 'butter', 'brown sugar', 'eggs'], notes: '' },
  { id: 'r10', name: 'RICE KRISPIES', creatorColor: '#6B8CAE', lastMade: null, ingredients: ['rice krispies', 'butter', 'marshmallows'], notes: 'Melt butter and marshmallows over low heat, fold in cereal, press into tin and cool.' },
  { id: 'r11', name: 'TOFU CREAM UDON', creatorColor: '#5A6E7F', lastMade: 'Dec 19th, 2025', ingredients: ['udon noodles', 'silken tofu', 'dashi', 'mirin', 'soy sauce', 'spring onion'], notes: '' },
  { id: 'r12', name: 'DUBAI CHOCOLATE', creatorColor: '#C0392B', lastMade: null, ingredients: ['dark chocolate', 'kadayif', 'pistachio paste', 'tahini', 'butter'], notes: 'Toast the kadayif until golden. Mix with pistachio paste while warm.' },
  { id: 'r13', name: 'SOURDOUGH', creatorColor: '#8B6F47', lastMade: 'Jan 2nd, 2025', ingredients: ['bread flour', 'sourdough starter', 'water', 'salt'], notes: '75% hydration. Bulk ferment 4h at room temp, shape, cold proof overnight, bake in dutch oven.' },
  { id: 'r14', name: 'CIABATTA', creatorColor: '#6B8CAE', lastMade: null, ingredients: ['bread flour', 'yeast', 'olive oil', 'water', 'salt'], notes: '' },
];

export const DIARY = {
  month: 'FEBRUARY 2026',
  year: 2026,
  monthIndex: 1, // 0-based (January = 0)
  // Days of the month that have a logged meal
  loggedDays: [2, 3, 4, 7, 8, 9, 10, 11],
  stats: {
    recipesShared: 3,
    dishesLogged: 8,
    newRecipes: 2,
    challengeRecipes: 1,
    dayStreak: 4,
  },
  challengeTitle: 'LUNAR NEW YEAR\nWINTER PRODUCE\nCHALLENGE',
  challengeDetail: {
    description: "February is historically a month associated with Lunar New Year festivities, flaunting some of winter's best produce items. Light a lantern by:",
    loggingPrompt: 'Logging a dish with a seasonal ingredient:',
    ingredients: [
      { emoji: '🥬', label: 'CAULIFLOWER' },
      { emoji: '🍊', label: 'CITRUS FRUITS' },
      { emoji: '🫚', label: 'BEETROOT' },
      { emoji: '🥦', label: 'BROCCOLI' },
      { emoji: '🧅', label: 'LEEKS' },
      { emoji: '🍖', label: 'GAME MEATS' },
    ],
    recipePrompt: 'Trying one of these featured LNY recipes!',
    featuredRecipes: [
      'MALAYSIAN BAK KWA',
      'KOREAN TTEOKGUK (RICE CAKE SOUP)',
      'SPRING ROLLS',
      'YU SHENG',
    ],
  },
  progress: 6,
  total: 10,
  mealsUntilBadge: 4,
  dishesThisWeek: [
    { id: 'w1', bg: '#2C1810', emoji: '🍜' },
    { id: 'w2', bg: '#4A3B6B', emoji: '🍚' },
    { id: 'w3', bg: '#8B6F47', emoji: '🥧' },
    { id: 'w4', bg: '#E8D5B7', emoji: '🥞' },
    { id: 'w5', bg: '#E8E4E0', emoji: '' },
    { id: 'w6', bg: '#E8E4E0', emoji: '' },
  ],
};

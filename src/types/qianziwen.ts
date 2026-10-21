export interface CharacterItem {
  id: string;
  char: string;
  pinyin: string;
  toneNumber: number; // 0 = 轻声；1, 2, 3, 4 = 四声
  meaning: string;
  words: string[];
  example: string;
  hotspotLabel?: string;
  hotspotX?: number; // percentage on illustration 0-100
  hotspotY?: number;
}

export interface QianziwenPeriod {
  periodNumber: number;
  title: string;
  subtitle: string;
  startUnit: number;
  endUnit: number;
  unitCount: number;
  landmark: string;
  theme: string;
}

export interface QianziwenUnit {
  id: number;
  unitNumber: number;
  periodNumber: number;
  periodTitle: string;
  title: string;
  subtitle: string;
  phrase1: string; // e.g. "天地玄黄"
  pinyin1: string; // e.g. "tiān dì xuán huáng"
  phrase2: string; // e.g. "宇宙洪荒"
  pinyin2: string; // e.g. "yǔ zhòu hóng huāng"
  fullText: string;
  fullPinyin: string;
  meaning: string;
  meaning1: string; // 句一解释（前四字）
  meaning2: string; // 句二解释（后四字）
  characters: CharacterItem[];
  illustration: string;
  locationName: string; // e.g. "竹林书院", "青山古亭"
}

export interface MistakeRecord {
  id: string;
  char: string;
  pinyin: string;
  questionType: 'PINYIN' | 'LISTEN' | 'SORT';
  userAnswer: string;
  correctAnswer: string;
  timestamp: number;
}

export interface UserProgress {
  currentUnitId: number;
  completedUnits: number[]; // unit IDs that have completed tests
  stars: number;
  learnedChars: string[];
  masteredChars: string[];
  correctAnswersCount: number;
  totalAnswersCount: number;
  streakDays: number;
  mistakes: MistakeRecord[];
  badges: string[];
}

export type ViewTab =
  | 'HOME'
  | 'LITERACY'          // 1. 千字文识字馆
  | 'PINYIN'            // 2. 拼音修炼坊
  | 'LISTEN_IDENTIFY'    // 3. 听音识字阁
  | 'POETRY_SORT'       // 4. 诗句排序坊
  | 'READING_HALL'      // 5. 千字文朗读堂
  | 'ADVENTURE_MAP'     // 6. 国风闯关地图
  | 'GROWTH_SCROLL';    // 7. 我的成长书卷

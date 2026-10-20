import { UserProgress, MistakeRecord } from '../types/qianziwen';

const STORAGE_KEY = 'qianziwen_adventure_progress_v1';

export const INITIAL_PROGRESS: UserProgress = {
  currentUnitId: 1,
  completedUnits: [1], // Unit 1 starts open
  stars: 3,
  learnedChars: ["天", "地", "玄", "黄", "宇", "宙", "洪", "荒"],
  masteredChars: ["天", "地"],
  correctAnswersCount: 12,
  totalAnswersCount: 14,
  streakDays: 3,
  mistakes: [
    {
      id: "mistake-1",
      char: "玄",
      pinyin: "xuán",
      questionType: "PINYIN",
      userAnswer: "xuàn",
      correctAnswer: "xuán",
      timestamp: Date.now() - 3600000
    }
  ],
  badges: ["识字小书童"]
};

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PROGRESS, ...parsed };
  } catch (e) {
    console.error('Failed to load progress from localStorage:', e);
    return INITIAL_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage:', e);
  }
}

export function addMistake(record: Omit<MistakeRecord, 'id' | 'timestamp'>): void {
  const current = loadProgress();
  const newRecord: MistakeRecord = {
    ...record,
    id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now()
  };
  const filtered = current.mistakes.filter(m => !(m.char === record.char && m.questionType === record.questionType));
  current.mistakes = [newRecord, ...filtered].slice(0, 30);
  current.totalAnswersCount += 1;
  saveProgress(current);
}

export function recordCorrectAnswer(char: string): void {
  const current = loadProgress();
  current.correctAnswersCount += 1;
  current.totalAnswersCount += 1;
  if (!current.masteredChars.includes(char)) {
    current.masteredChars.push(char);
  }
  // Remove from mistakes if resolved
  current.mistakes = current.mistakes.filter(m => m.char !== char);
  saveProgress(current);
}

export function awardStars(count: number): void {
  const current = loadProgress();
  current.stars += count;
  saveProgress(current);
}

export function unlockUnit(unitId: number): void {
  const current = loadProgress();
  if (!current.completedUnits.includes(unitId)) {
    current.completedUnits.push(unitId);
  }
  if (current.currentUnitId < unitId) {
    current.currentUnitId = unitId;
  }
  saveProgress(current);
}

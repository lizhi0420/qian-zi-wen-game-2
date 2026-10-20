import React, { useState, useEffect } from 'react';
import { QianziwenUnit, CharacterItem } from '../types/qianziwen';
import { ScholarMascot } from './ScholarMascot';
import { Volume2, RotateCcw, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { awardStars, recordCorrectAnswer } from '../utils/storage';

interface PoetrySortProps {
  currentUnit: QianziwenUnit;
  onStarsEarned: (stars: number) => void;
}

type SortDifficulty = 'PHRASE1' | 'PHRASE2' | 'FULL_8';

export const PoetrySortView: React.FC<PoetrySortProps> = ({
  currentUnit,
  onStarsEarned,
}) => {
  const [difficulty, setDifficulty] = useState<SortDifficulty>('PHRASE1');
  const [targetItems, setTargetItems] = useState<CharacterItem[]>([]);
  const [currentSlots, setCurrentSlots] = useState<(CharacterItem | null)[]>([]);
  const [availableCards, setAvailableCards] = useState<CharacterItem[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    initRound(difficulty);
  }, [difficulty, currentUnit]);

  const initRound = (diff: SortDifficulty) => {
    let target: CharacterItem[] = [];
    if (diff === 'PHRASE1') {
      target = currentUnit.characters.slice(0, 4);
    } else if (diff === 'PHRASE2') {
      target = currentUnit.characters.slice(4, 8);
    } else {
      target = currentUnit.characters.slice(0, 8);
    }

    setTargetItems(target);
    setCurrentSlots(new Array(target.length).fill(null));

    // Scramble available cards
    const scrambled = [...target].sort(() => Math.random() - 0.5);
    setAvailableCards(scrambled);
    setIsCompleted(false);
  };

  // Place a card into the next empty slot
  const handleSelectCard = (item: CharacterItem) => {
    if (isCompleted) return;
    sound.playWoodblock();

    const emptyIndex = currentSlots.findIndex(slot => slot === null);
    if (emptyIndex === -1) return;

    const newSlots = [...currentSlots];
    newSlots[emptyIndex] = item;
    setCurrentSlots(newSlots);

    setAvailableCards(prev => prev.filter(c => c.id !== item.id));

    // Check if slots are now full
    if (emptyIndex === currentSlots.length - 1) {
      checkOrdering(newSlots as CharacterItem[]);
    }
  };

  // Click a slot to return card to pool
  const handleRemoveFromSlot = (index: number) => {
    if (isCompleted) return;
    const item = currentSlots[index];
    if (!item) return;

    sound.playWoodblock();
    const newSlots = [...currentSlots];
    newSlots[index] = null;
    setCurrentSlots(newSlots);
    setAvailableCards(prev => [...prev, item]);
  };

  const checkOrdering = (slots: CharacterItem[]) => {
    const isCorrect = slots.every((item, i) => item.id === targetItems[i].id);

    if (isCorrect) {
      setIsCompleted(true);
      sound.playChime(880);
      setTimeout(() => {
        sound.playVictoryArpeggio();
        // Speak full ordered text
        const orderedText = slots.map(c => c.char).join('');
        sound.speak(`诵读：${orderedText}。太棒了，诗句复原成功！`);
        slots.forEach(s => recordCorrectAnswer(s.char));
        awardStars(2);
        onStarsEarned(2);
      }, 500);
    } else {
      sound.playGentleOops();
      setTimeout(() => {
        sound.speak('顺序好像不太对哦，点击字卡收回，再仔细想想原文顺序吧！');
      }, 300);
    }
  };

  const fullTargetVerse = targetItems.map(c => c.char).join('');

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FCFAF4] border border-[#E5DAC8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="seal-stamp text-xs px-2.5 py-0.5">诗韵排序</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2A2421] font-guofeng">
              诗句排序坊 · {currentUnit.title}
            </h2>
          </div>
          <p className="text-xs text-[#7B6E60] font-guofeng mt-1">
            将打乱顺序的字卡重新排列，重现《千字文》朗朗上口的四言诗句。
          </p>
        </div>

        {/* Difficulty Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-[#EFE8D6] rounded-xl border border-[#D8CBB6]">
            <button
              onClick={() => {
                sound.playWoodblock();
                setDifficulty('PHRARASE1' as unknown as SortDifficulty === 'PHRASE1' ? 'PHRASE1' : 'PHRASE1');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                difficulty === 'PHRASE1'
                  ? 'bg-white text-[#3F5E4D] shadow-xs'
                  : 'text-[#6D5D4E] hover:text-[#2A2421]'
              }`}
            >
              前四字 ({currentUnit.phrase1})
            </button>
            <button
              onClick={() => {
                sound.playWoodblock();
                setDifficulty('PHRASE2');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                difficulty === 'PHRASE2'
                  ? 'bg-white text-[#3F5E4D] shadow-xs'
                  : 'text-[#6D5D4E] hover:text-[#2A2421]'
              }`}
            >
              后四字 ({currentUnit.phrase2})
            </button>
            <button
              onClick={() => {
                sound.playWoodblock();
                setDifficulty('FULL_8');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                difficulty === 'FULL_8'
                  ? 'bg-white text-[#3F5E4D] shadow-xs'
                  : 'text-[#6D5D4E] hover:text-[#2A2421]'
              }`}
            >
              八字挑战 (进阶)
            </button>
          </div>

          <button
            onClick={() => {
              sound.playWoodblock();
              initRound(difficulty);
            }}
            title="重新排序"
            className="p-2 rounded-xl bg-white border border-[#D8CBB6] text-[#6F6051] hover:text-[#2A2421] transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Sorting Stage */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF7F0] border-2 border-[#D9CABB] shadow-md bg-xuan-paper space-y-8">
          
          {/* Target Slots Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#7B6E60]">
              <span className="font-semibold text-[#544638]">
                请将字卡按正确诗句顺序排入下方木简方格中（点击格子可取回字卡）：
              </span>
              <span>
                {currentSlots.filter(s => s !== null).length} / {targetItems.length}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 py-3">
              {currentSlots.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveFromSlot(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    item
                      ? 'bg-white border-[#3F5E4D] shadow-md hover:scale-95'
                      : 'bg-[#F2EDE1]/60 border-dashed border-[#D2C3AA] text-[#B8A690]'
                  }`}
                >
                  {item ? (
                    <div className="flex flex-col items-center animate-ink-appear">
                      <span className="text-[11px] font-mono text-[#827161]">{item.pinyin}</span>
                      <span className="text-3xl sm:text-4xl font-black text-[#2A2421] font-guofeng">
                        {item.char}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#BAA995] font-mono font-medium">
                      第 {idx + 1} 字
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Available Scrambled Cards Pool */}
          <div className="space-y-3 pt-4 border-t border-[#E3DAC8]">
            <span className="text-xs font-semibold text-[#8B7865] font-guofeng block text-center">
              备选待排字卡（点击填入上方空白格）
            </span>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {availableCards.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectCard(item)}
                  className="w-14 h-18 sm:w-16 sm:h-20 rounded-2xl bg-white border-2 border-[#DACBB5] hover:border-[#3F5E4D] hover:-translate-y-1 shadow-sm hover:shadow-md flex flex-col items-center justify-center transition-all cursor-pointer group"
                >
                  <span className="text-[10px] font-mono text-[#8C7A6A] group-hover:text-[#3F5E4D]">
                    {item.pinyin}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#2A2421] font-guofeng group-hover:text-[#3F5E4D]">
                    {item.char}
                  </span>
                </button>
              ))}
              {availableCards.length === 0 && !isCompleted && (
                <span className="text-xs text-[#8D7D6E] italic">
                  字卡已全部填入，若顺序有误请点击上方字卡重新调整！
                </span>
              )}
            </div>
          </div>

          {/* Success Banner */}
          {isCompleted && (
            <div className="p-6 rounded-2xl bg-[#EBF5EE] border-2 border-[#3F5E4D] space-y-4 animate-ink-appear text-center">
              <div className="flex items-center justify-center gap-2 text-[#3F5E4D]">
                <CheckCircle2 className="w-6 h-6" />
                <h4 className="text-lg font-bold font-guofeng">
                  太绝妙了！诗句排序成功！
                </h4>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-[#2A2421] font-guofeng tracking-widest py-1">
                {fullTargetVerse}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => sound.speak(fullTargetVerse)}
                  className="px-4 py-2 rounded-xl bg-[#3F5E4D] hover:bg-[#324B3D] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>重听朗读</span>
                </button>

                <button
                  onClick={() => {
                    if (difficulty === 'PHRASE1') setDifficulty('PHRASE2');
                    else if (difficulty === 'PHRASE2') setDifficulty('FULL_8');
                    else setDifficulty('PHRASE1');
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-[#D5C6AE] text-[#3D3024] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#FAF7F0] transition-colors shadow-xs cursor-pointer"
                >
                  <span>下一轮排序挑战</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Mascot Companion */}
      <ScholarMascot
        message="《千字文》四字一句，朗朗上口，韵律感极强！比如‘天地玄黄’押韵，‘宇宙洪荒’对仗。多念两遍就能轻松排好啦！"
        subMessage="小书童伴学：点击格子里的字卡可以收回，排好后系统会自动检验并示范朗读哦！"
      />
    </div>
  );
};

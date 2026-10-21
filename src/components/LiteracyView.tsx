import React, { useState } from 'react';
import { QianziwenUnit, CharacterItem } from '../types/qianziwen';
import { ScholarMascot } from './ScholarMascot';
import { 
  Volume2, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  X, 
  Mic, 
  BookMarked
} from 'lucide-react';
import { sound } from '../utils/audio';

interface LiteracyViewProps {
  currentUnit: QianziwenUnit;
  allUnits: QianziwenUnit[];
  onSelectUnit: (unit: QianziwenUnit) => void;
  onCharacterLearned: (char: string) => void;
}

export const LiteracyView: React.FC<LiteracyViewProps> = ({
  currentUnit,
  allUnits,
  onSelectUnit,
  onCharacterLearned,
}) => {
  const [hidePinyin, setHidePinyin] = useState(false);
  const [selectedChar, setSelectedChar] = useState<CharacterItem | null>(null);
  const [readAlongActive, setReadAlongActive] = useState(false);
  const [learnedMap, setLearnedMap] = useState<Record<string, boolean>>({});

  const handleOpenDetail = (item: CharacterItem) => {
    sound.playWoodblock();
    sound.speak(item.char);
    setSelectedChar(item);
    setLearnedMap(prev => ({ ...prev, [item.char]: true }));
    onCharacterLearned(item.char);
  };

  const handleSpeakChar = (item: CharacterItem) => {
    sound.speak(item.char);
  };

  const handleSpeakSentence = (sentence: string) => {
    sound.speak(sentence);
  };

  const handleNextChar = () => {
    if (!selectedChar) return;
    const currentIndex = currentUnit.characters.findIndex(c => c.id === selectedChar.id);
    const nextIndex = (currentIndex + 1) % currentUnit.characters.length;
    const nextChar = currentUnit.characters[nextIndex];
    setSelectedChar(nextChar);
    sound.playWoodblock();
    sound.speak(nextChar.char);
    setLearnedMap(prev => ({ ...prev, [nextChar.char]: true }));
    onCharacterLearned(nextChar.char);
  };

  const handleReadAlong = (item: CharacterItem) => {
    setReadAlongActive(true);
    sound.speak(item.char, () => {
      setTimeout(() => {
        sound.playChime(660);
      }, 1200);
    });
  };

  // Play whole unit reading
  const handleReadWholeUnit = () => {
    sound.playWoodblock();
    sound.speak(currentUnit.fullText);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Unit Selection Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FCFAF4] border border-[#E5DAC8] shadow-xs">
        <div className="flex items-center gap-3">
          <span className="seal-stamp text-xs px-2.5 py-1">第 {currentUnit.unitNumber} 课</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2A2421] font-guofeng">
              {currentUnit.title} · {currentUnit.locationName}
            </h2>
            <p className="text-xs text-[#7B6E60] font-guofeng">
              {currentUnit.subtitle}
            </p>
          </div>
        </div>

        {/* Controls: Unit Dropdown + Pinyin Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Unit selector */}
          <select
            value={currentUnit.id}
            onChange={(e) => {
              const target = allUnits.find(u => u.id === Number(e.target.value));
              if (target) {
                sound.playWoodblock();
                onSelectUnit(target);
              }
            }}
            className="px-3 py-1.5 text-xs font-medium text-[#3D3025] bg-white border border-[#D8CBB6] rounded-xl shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#3F5E4D]"
          >
            {allUnits.map(u => (
              <option key={u.id} value={u.id}>
                第 {u.unitNumber} 单元：{u.phrase1}
              </option>
            ))}
          </select>

          {/* Toggle Pinyin button */}
          <button
            onClick={() => {
              sound.playWoodblock();
              setHidePinyin(!hidePinyin);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#46392D] bg-[#F1E8D2] hover:bg-[#EAE0C5] border border-[#D5C6A8] rounded-xl transition-colors cursor-pointer"
          >
            {hidePinyin ? <EyeOff className="w-3.5 h-3.5 text-[#BA3329]" /> : <Eye className="w-3.5 h-3.5 text-[#3F5E4D]" />}
            <span>{hidePinyin ? '显示拼音' : '隐藏拼音(自主读)'}</span>
          </button>

          {/* Listen full text */}
          <button
            onClick={handleReadWholeUnit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#3F5E4D] hover:bg-[#324B3D] rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>听诵整句</span>
          </button>
        </div>
      </div>

      {/* Main Verse Board with Calligraphy & Pinyin */}
      <section className="relative overflow-hidden rounded-3xl border border-[#D8C8B0] bg-[#FAF7F0] shadow-sm p-6 sm:p-8 text-center bg-xuan-paper">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#8B7865] tracking-widest font-guofeng uppercase">
            <span>——</span>
            <span>四言古韵 · 诵读品味</span>
            <span>——</span>
          </div>

          {/* 8 characters displayed in two 4-character phrases */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 justify-center items-center py-2">
            {/* Phrase 1 */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {currentUnit.characters.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenDetail(item)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <span className={`text-xs sm:text-sm font-medium text-[#5D5043] transition-opacity duration-200 h-5 font-mono ${hidePinyin ? 'opacity-0' : 'opacity-100'}`}>
                    {item.pinyin}
                  </span>
                  <div className="w-11 h-13 sm:w-14 sm:h-16 flex items-center justify-center rounded-xl bg-white border border-[#DACBB5] shadow-xs group-hover:border-[#3F5E4D] group-hover:bg-[#F2F7F3] group-hover:shadow-md transition-all">
                    <span className="text-2xl sm:text-3xl font-black text-[#2A2421] font-guofeng group-hover:text-[#3F5E4D]">
                      {item.char}
                    </span>
                  </div>
                </div>
              ))}
              <span className="text-xl sm:text-2xl font-bold text-[#827161] font-guofeng mt-5">，</span>
            </div>

            {/* Phrase 2 */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {currentUnit.characters.slice(4, 8).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenDetail(item)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <span className={`text-xs sm:text-sm font-medium text-[#5D5043] transition-opacity duration-200 h-5 font-mono ${hidePinyin ? 'opacity-0' : 'opacity-100'}`}>
                    {item.pinyin}
                  </span>
                  <div className="w-11 h-13 sm:w-14 sm:h-16 flex items-center justify-center rounded-xl bg-white border border-[#DACBB5] shadow-xs group-hover:border-[#3F5E4D] group-hover:bg-[#F2F7F3] group-hover:shadow-md transition-all">
                    <span className="text-2xl sm:text-3xl font-black text-[#2A2421] font-guofeng group-hover:text-[#3F5E4D]">
                      {item.char}
                    </span>
                  </div>
                </div>
              ))}
              <span className="text-xl sm:text-2xl font-bold text-[#827161] font-guofeng mt-5">。</span>
            </div>
          </div>

          {/* 原文通释板块 */}
          <div className="max-w-2xl mx-auto mt-4 bg-[#F3EDE0]/80 p-3.5 sm:p-4 rounded-2xl border border-[#E3DAC8] shadow-2xs text-left">
            <div className="flex items-center justify-between text-xs font-bold text-[#8B7865] pb-2 border-b border-[#E5DAC8] mb-2.5 font-guofeng">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[#3F5E4D] rounded-full inline-block"></span>
                <span>原文释义 · 全篇通译</span>
              </span>
              <button
                onClick={() => sound.speak(currentUnit.meaning)}
                title="听译文朗读"
                className="flex items-center gap-1 text-[11px] text-[#3F5E4D] hover:text-[#284937] px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-[#D8CBB6] transition-colors cursor-pointer shadow-2xs font-sans"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>听译文朗读</span>
              </button>
            </div>
            <p className="text-sm sm:text-base text-[#4E4034] font-guofeng leading-relaxed">
              {currentUnit.meaning}
            </p>
          </div>
        </div>
      </section>

      {/* Centerpiece: Watercolor Illustration Backdrop */}
      <div className="relative rounded-3xl overflow-hidden border border-[#D5C6AC] shadow-sm max-h-[340px] group">
        <img
          src={currentUnit.illustration}
          key={currentUnit.id}
          alt={`${currentUnit.fullText} 国风水彩意境图`}
          referrerPolicy="no-referrer"
          className="w-full aspect-[16/9] sm:aspect-[21/9] object-cover max-h-[340px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
          <div>
            <span className="text-xs text-[#EFE8D6] font-guofeng">国风水彩绘卷 · {currentUnit.locationName}</span>
            <p className="text-sm font-bold font-guofeng mt-0.5">
              点击下方字卡，即可进入汉字字义、组词与标准读音学习
            </p>
          </div>
          <button
            onClick={() => {
              sound.playWoodblock();
              handleSpeakChar(currentUnit.characters[0]);
            }}
            className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F6D06F]" />
            <span>开始字卡探究</span>
          </button>
        </div>
      </div>

      {/* 8 Ancient Scroll Literacy Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#2A2421] font-guofeng flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-[#3F5E4D]" />
            <span>本单元 8 张识字卡</span>
          </h3>
          <span className="text-xs text-[#7B6E60]">
            已探索：{Object.keys(learnedMap).length} / 8 字
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {currentUnit.characters.map((item, idx) => {
            const isLearned = learnedMap[item.char];
            return (
              <button
                key={item.id}
                onClick={() => handleOpenDetail(item)}
                className="relative text-left p-3.5 rounded-2xl bg-white hover:bg-[#F9F7F1] border border-[#DDD0BC] hover:border-[#3F5E4D] shadow-xs hover:shadow-md transition-all group flex flex-col items-center cursor-pointer"
              >
                {/* Order label */}
                <span className="text-[10px] text-[#A2917F] font-mono mb-1">
                  0{idx + 1}
                </span>

                {/* Pinyin */}
                <span className={`text-xs font-medium text-[#7A6A5A] font-mono h-4 ${hidePinyin ? 'invisible' : ''}`}>
                  {item.pinyin}
                </span>

                {/* Main Character */}
                <span className="text-3xl font-black text-[#2A2421] font-guofeng my-1 group-hover:scale-110 group-hover:text-[#3F5E4D] transition-transform">
                  {item.char}
                </span>

                {/* Words hint */}
                <span className="text-[11px] text-[#867564] truncate max-w-[80px] font-guofeng">
                  {item.words[0]}
                </span>

                {/* Stamp if learned */}
                {isLearned && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#3F5E4D] text-white text-[9px] flex items-center justify-center shadow-xs">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mascot Encouragement */}
      <ScholarMascot
        message={`《千字文》里的每个字都有优美的意境！点击任何一张字卡，小书童会为你朗读拼音、解释字义，还有例句带你理解。`}
        subMessage="识记完8个汉字后，可以前往“拼音修炼坊”或“听音识字阁”开始挑战哦！"
      />

      {/* Character Detail Popover / Modal */}
      {selectedChar && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#FAF7F0] border-2 border-[#D8C7AB] rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden bg-scroll-parchment animate-ink-appear">
            {/* Close Button */}
            <button
              onClick={() => setSelectedChar(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#7B6E60] hover:text-[#2A2421] hover:bg-[#EBE3D0] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: Large Character & Pinyin */}
            <div className="flex items-center gap-6 pb-6 border-b border-[#E3DAC8]">
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-white border-2 border-[#C9BAA2] shadow-sm flex flex-col items-center justify-center shrink-0">
                <span className="text-xs font-mono text-[#877564]">{selectedChar.pinyin}</span>
                <span className="text-5xl sm:text-6xl font-black text-[#2A2421] font-guofeng">
                  {selectedChar.char}
                </span>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="seal-stamp text-xs px-2 py-0.5">常用汉字</span>
                  <span className="text-xs text-[#827161]">
                    声调：{selectedChar.toneNumber === 0 ? '轻声' : `第 ${selectedChar.toneNumber} 声`}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-[#2A2421] font-guofeng truncate">
                  汉字：{selectedChar.char}（{selectedChar.pinyin}）
                </h4>
                <p className="text-xs text-[#6F6051] line-clamp-2 leading-relaxed">
                  {selectedChar.meaning}
                </p>
              </div>
            </div>

            {/* Content: Vocabulary and Example Sentence */}
            <div className="py-5 space-y-4 text-sm">
              <div>
                <span className="text-xs font-bold text-[#3F5E4D] font-guofeng tracking-wider uppercase block mb-1.5">
                  【 适龄组词 】
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedChar.words.map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => sound.speak(w)}
                      className="px-3 py-1 rounded-xl bg-white border border-[#D5C6AE] text-xs font-semibold text-[#3C3024] hover:border-[#3F5E4D] hover:text-[#3F5E4D] transition-colors shadow-xs cursor-pointer"
                    >
                      {w} 🔊
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#3F5E4D] font-guofeng tracking-wider uppercase block mb-1.5">
                  【 优美例句 】
                </span>
                <div 
                  onClick={() => handleSpeakSentence(selectedChar.example)}
                  className="p-3 rounded-xl bg-white/70 border border-[#DACBB5] text-xs sm:text-sm text-[#43372B] leading-relaxed cursor-pointer hover:bg-white transition-colors flex items-start justify-between gap-2"
                >
                  <p>{selectedChar.example}</p>
                  <Volume2 className="w-4 h-4 text-[#3F5E4D] shrink-0 mt-0.5" />
                </div>
              </div>

              {readAlongActive && (
                <div className="p-2.5 rounded-xl bg-[#E8F0EA] border border-[#BBD4C3] text-xs text-[#284937] flex items-center gap-2 animate-pulse">
                  <Mic className="w-4 h-4 text-[#3F5E4D]" />
                  <span>小书童提示：请大声跟读三遍 “{selectedChar.char} —— {selectedChar.pinyin}”！</span>
                </div>
              )}
            </div>

            {/* Four Action Buttons requested by user:
                1. 听发音
                2. 看字义 (already shown, speaks meaning)
                3. 跟我读
                4. 下一个字
            */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-[#E3DAC8]">
              <button
                onClick={() => handleSpeakChar(selectedChar)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#3F5E4D] hover:bg-[#324B3D] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>听发音</span>
              </button>

              <button
                onClick={() => sound.speak(`${selectedChar.char}，字义：${selectedChar.meaning}`)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white hover:bg-[#F2ECE0] border border-[#D5C6AE] text-[#3D3024] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <BookMarked className="w-3.5 h-3.5 text-[#A06D3B]" />
                <span>读字义</span>
              </button>

              <button
                onClick={() => handleReadAlong(selectedChar)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white hover:bg-[#F2ECE0] border border-[#D5C6AE] text-[#3D3024] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-[#3F5E4D]" />
                <span>跟我读</span>
              </button>

              <button
                onClick={handleNextChar}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#F0E6D0] hover:bg-[#E5D7BC] border border-[#CEBE9F] text-[#413326] text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <span>下一个字</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

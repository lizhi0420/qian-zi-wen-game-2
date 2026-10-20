import React, { useState, useEffect, useRef } from 'react';
import { QianziwenUnit, CharacterItem } from '../types/qianziwen';
import { ScholarMascot } from './ScholarMascot';
import { 
  Volume2, 
  Play, 
  Square, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Mic, 
  Gauge, 
  Sparkles 
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ReadingHallProps {
  currentUnit: QianziwenUnit;
  allUnits: QianziwenUnit[];
  onSelectUnit: (unit: QianziwenUnit) => void;
}

export const ReadingHallView: React.FC<ReadingHallProps> = ({
  currentUnit,
  allUnits,
  onSelectUnit,
}) => {
  const [hidePinyin, setHidePinyin] = useState(false);
  const [autoPage, setAutoPage] = useState(false);
  const [speed, setSpeed] = useState<number>(0.85); // 0.7, 0.85, 1.0
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<'IDLE' | 'CHAR_BY_CHAR' | 'CONTINUOUS' | 'FOLLOW_READ'>('IDLE');
  const timerRef = useRef<number | null>(null);

  // Stop any reading when unmounted or unit changes
  useEffect(() => {
    return () => {
      sound.stopSpeech();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentUnit]);

  const handleStop = () => {
    sound.stopSpeech();
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setActiveCharIndex(null);
    setMode('IDLE');
  };

  // 1. 逐字朗读 (Char by Char)
  const handleCharByCharRead = () => {
    handleStop();
    setIsPlaying(true);
    setMode('CHAR_BY_CHAR');

    let idx = 0;
    const playNext = () => {
      if (idx >= currentUnit.characters.length) {
        setIsPlaying(false);
        setActiveCharIndex(null);
        setMode('IDLE');
        if (autoPage) handleNextUnit();
        return;
      }

      setActiveCharIndex(idx);
      const char = currentUnit.characters[idx];
      sound.speak(char.char, () => {
        timerRef.current = window.setTimeout(() => {
          idx++;
          playNext();
        }, 350);
      }, speed);
    };

    playNext();
  };

  // 2. 逐句朗读 (Sentence by Sentence)
  const handleSentenceRead = (phrase: string, startIndex: number) => {
    handleStop();
    setIsPlaying(true);
    setMode('CONTINUOUS');

    // Highlight the 4 characters
    sound.speak(phrase, () => {
      setIsPlaying(false);
      setActiveCharIndex(null);
      setMode('IDLE');
    }, speed);
  };

  // 3. 整个单元连续朗读
  const handleContinuousRead = () => {
    handleStop();
    setIsPlaying(true);
    setMode('CONTINUOUS');

    sound.speak(`${currentUnit.phrase1}，${currentUnit.phrase2}。`, () => {
      setIsPlaying(false);
      setMode('IDLE');
      if (autoPage) {
        setTimeout(handleNextUnit, 1000);
      }
    }, speed);
  };

  // 4. 跟读练习
  const handleFollowRead = () => {
    handleStop();
    setIsPlaying(true);
    setMode('FOLLOW_READ');

    sound.speak(`小书童示范：${currentUnit.fullText}。请小明友跟着大声朗读一遍！`, () => {
      setTimeout(() => {
        sound.playChime(784);
        setIsPlaying(false);
        setMode('IDLE');
      }, 3500);
    }, speed);
  };

  const handlePrevUnit = () => {
    handleStop();
    const curIdx = allUnits.findIndex(u => u.id === currentUnit.id);
    if (curIdx > 0) {
      sound.playWoodblock();
      onSelectUnit(allUnits[curIdx - 1]);
    }
  };

  const handleNextUnit = () => {
    handleStop();
    const curIdx = allUnits.findIndex(u => u.id === currentUnit.id);
    if (curIdx < allUnits.length - 1) {
      sound.playWoodblock();
      onSelectUnit(allUnits[curIdx + 1]);
    }
  };

  const curIdx = allUnits.findIndex(u => u.id === currentUnit.id);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FCFAF4] border border-[#E5DAC8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="seal-stamp text-xs px-2.5 py-0.5">古籍吟诵</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2A2421] font-guofeng">
              千字文朗读堂 · 第 {currentUnit.unitNumber} 卷
            </h2>
          </div>
          <p className="text-xs text-[#7B6E60] font-guofeng mt-1">
            古籍线装翻页、逐字亮显、语速调节、伴读跟诵，沉浸式体会国学音韵之美。
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 p-1 bg-[#EFE8D6] rounded-xl border border-[#D8CBB6]">
            {[
              { label: '慢速 0.7x', val: 0.7 },
              { label: '童音 0.85x', val: 0.85 },
              { label: '标准 1.0x', val: 1.0 },
            ].map((s) => (
              <button
                key={s.val}
                onClick={() => {
                  sound.playWoodblock();
                  setSpeed(s.val);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  speed === s.val
                    ? 'bg-white text-[#3F5E4D] shadow-xs'
                    : 'text-[#6D5D4E] hover:text-[#2A2421]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Toggle Pinyin */}
          <button
            onClick={() => {
              sound.playWoodblock();
              setHidePinyin(!hidePinyin);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#46392D] bg-[#F1E8D2] hover:bg-[#EAE0C5] border border-[#D5C6A8] rounded-xl transition-colors cursor-pointer"
          >
            {hidePinyin ? <EyeOff className="w-3.5 h-3.5 text-[#BA3329]" /> : <Eye className="w-3.5 h-3.5 text-[#3F5E4D]" />}
            <span>{hidePinyin ? '显示拼音' : '隐藏拼音'}</span>
          </button>

          {/* Auto Page Toggle */}
          <button
            onClick={() => {
              sound.playWoodblock();
              setAutoPage(!autoPage);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              autoPage
                ? 'bg-[#3F5E4D] text-white border-[#3F5E4D]'
                : 'bg-white text-[#6A5A4A] border-[#D5C6AE]'
            }`}
          >
            自动翻页：{autoPage ? '开' : '关'}
          </button>
        </div>
      </div>

      {/* Ancient Book Page Frame */}
      <div className="max-w-4xl mx-auto relative rounded-3xl border-4 border-[#C9B99E] bg-[#FAF7F0] p-6 sm:p-10 shadow-xl bg-scroll-parchment"
        style={{ backgroundImage: `linear-gradient(rgba(253,251,247,.88), rgba(245,239,225,.9)), url("${currentUnit.illustration}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        
        {/* Book Spine Stitching Effect */}
        <div className="absolute top-0 bottom-0 left-6 sm:left-8 w-1 border-r border-dashed border-[#B8A68B] hidden md:block"></div>

        <div className="md:pl-10 space-y-6">
          {/* Top Title */}
          <div className="flex items-center justify-between border-b border-[#E0D5C1] pb-3">
            <span className="text-xs font-bold text-[#867563] tracking-widest font-guofeng">
              【千字文 · 卷之{currentUnit.unitNumber}】 {currentUnit.title}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevUnit}
                disabled={curIdx <= 0}
                className="p-1.5 rounded-lg text-[#6F6051] hover:bg-[#EBE2CF] disabled:opacity-30 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono text-[#827161]">
                {curIdx + 1} / {allUnits.length}
              </span>
              <button
                onClick={handleNextUnit}
                disabled={curIdx >= allUnits.length - 1}
                className="p-1.5 rounded-lg text-[#6F6051] hover:bg-[#EBE2CF] disabled:opacity-30 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Verse Text Area with Character Highlighting */}
          <div className="py-6 text-center space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-10 justify-center">
              {/* Phrase 1 */}
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                {currentUnit.characters.slice(0, 4).map((item, idx) => {
                  const isHighlighted = activeCharIndex === idx;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        sound.playWoodblock();
                        sound.speak(item.char);
                      }}
                      className={`flex flex-col items-center p-2 rounded-2xl transition-all cursor-pointer ${
                        isHighlighted
                          ? 'bg-[#FAF3D8] ring-3 ring-[#C69A57] scale-110 shadow-lg'
                          : 'hover:bg-white/80'
                      }`}
                    >
                      <span className={`text-xs sm:text-sm font-medium font-mono text-[#7B6A59] h-5 ${hidePinyin ? 'invisible' : ''}`}>
                        {item.pinyin}
                      </span>
                      <span className="text-3xl sm:text-5xl font-black text-[#2A2421] font-guofeng">
                        {item.char}
                      </span>
                    </div>
                  );
                })}
                <span className="text-2xl font-bold text-[#8F7E6D] mt-6">，</span>
              </div>

              {/* Phrase 2 */}
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                {currentUnit.characters.slice(4, 8).map((item, idx) => {
                  const globalIdx = idx + 4;
                  const isHighlighted = activeCharIndex === globalIdx;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        sound.playWoodblock();
                        sound.speak(item.char);
                      }}
                      className={`flex flex-col items-center p-2 rounded-2xl transition-all cursor-pointer ${
                        isHighlighted
                          ? 'bg-[#FAF3D8] ring-3 ring-[#C69A57] scale-110 shadow-lg'
                          : 'hover:bg-white/80'
                      }`}
                    >
                      <span className={`text-xs sm:text-sm font-medium font-mono text-[#7B6A59] h-5 ${hidePinyin ? 'invisible' : ''}`}>
                        {item.pinyin}
                      </span>
                      <span className="text-3xl sm:text-5xl font-black text-[#2A2421] font-guofeng">
                        {item.char}
                      </span>
                    </div>
                  );
                })}
                <span className="text-2xl font-bold text-[#8F7E6D] mt-6">。</span>
              </div>
            </div>

            {/* Meaning Callout */}
            <p className="text-xs sm:text-sm text-[#6C5E4E] font-guofeng max-w-xl mx-auto leading-relaxed italic bg-white/50 p-3 rounded-xl border border-[#E3DAC8]">
              『{currentUnit.meaning}』
            </p>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-[#E0D5C1] flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleCharByCharRead}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#3F5E4D] hover:bg-[#324B3D] disabled:opacity-60 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>逐字点读</span>
            </button>

            <button
              onClick={() => handleSentenceRead(currentUnit.phrase1, 0)}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F2EDE1] disabled:opacity-60 border border-[#D5C6AE] text-[#3F3124] text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span>读前四字</span>
            </button>

            <button
              onClick={() => handleSentenceRead(currentUnit.phrase2, 4)}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F2EDE1] disabled:opacity-60 border border-[#D5C6AE] text-[#3F3124] text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span>读后四字</span>
            </button>

            <button
              onClick={handleContinuousRead}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F0E6D0] hover:bg-[#E5D7BC] disabled:opacity-60 border border-[#CEBE9F] text-[#413326] text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-[#3F5E4D]" />
              <span>整篇连读</span>
            </button>

            <button
              onClick={handleFollowRead}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F2EDE1] border border-[#3F5E4D] text-[#3F5E4D] text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>跟读练习</span>
            </button>

            {isPlaying && (
              <button
                onClick={handleStop}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#BA3329] hover:bg-[#9E2A20] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>停止朗读</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mascot Companion */}
      <ScholarMascot
        message={`读书百遍，其义自见！你可以选择“逐字点读”观察每个汉字的高亮发音，或者开启“跟读练习”跟着小书童一起朗朗吟诵！`}
        subMessage="小书童伴学：语速可以自由切换‘慢速 0.7x’、‘童音 0.85x’与‘标准 1.0x’，适合不同学习进度的小朋友。"
      />
    </div>
  );
};

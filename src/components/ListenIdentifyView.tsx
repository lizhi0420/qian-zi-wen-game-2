import React, { useState, useEffect } from 'react';
import { QianziwenUnit, CharacterItem } from '../types/qianziwen';
import { ScholarMascot } from './ScholarMascot';
import { Volume2, Sparkles, RotateCcw, Award } from 'lucide-react';
import { sound } from '../utils/audio';
import { recordCorrectAnswer, addMistake, awardStars } from '../utils/storage';

interface ListenIdentifyProps {
  currentUnit: QianziwenUnit;
  onStarsEarned: (stars: number) => void;
}

interface Question {
  target: CharacterItem;
  options: CharacterItem[];
}

export const ListenIdentifyView: React.FC<ListenIdentifyProps> = ({
  currentUnit,
  onStarsEarned,
}) => {
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shakeCard, setShakeCard] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [mascotHint, setMascotHint] = useState<string>('请听发音，点击正确的汉字卡片！');
  const [mistakesThisRound, setMistakesThisRound] = useState<string[]>([]);

  useEffect(() => {
    generateQuestions();
  }, [currentUnit]);

  const generateQuestions = () => {
    // Generate 10 rounds using unit's 8 characters
    const qList: Question[] = [];
    for (let i = 0; i < 10; i++) {
      const target = currentUnit.characters[i % currentUnit.characters.length];
      const otherChars = currentUnit.characters.filter(c => c.id !== target.id);
      const distractors = [...otherChars].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [target, ...distractors].sort(() => Math.random() - 0.5);
      qList.push({ target, options });
    }
    setQuestionList(qList);
    setCurrentIndex(0);
    setSelectedChar(null);
    setIsAnswered(false);
    setScore(0);
    setMistakesThisRound([]);
    setMascotHint('请听发音，点击正确的汉字卡片！');
  };

  const currentQ = questionList[currentIndex];

  // Auto-play pronunciation when question appears
  useEffect(() => {
    if (currentQ && !isAnswered) {
      sound.speak(currentQ.target.char);
    }
  }, [currentIndex, currentQ]);

  const handlePlayVoice = () => {
    if (currentQ) {
      sound.playWoodblock();
      sound.speak(currentQ.target.char);
    }
  };

  const handleSelect = (item: CharacterItem) => {
    if (isAnswered || !currentQ) return;
    setSelectedChar(item.char);
    setIsAnswered(true);

    if (item.char === currentQ.target.char) {
      setIsCorrect(true);
      sound.playChime(880);
      setScore(prev => prev + 1);
      setMascotHint(`真聪明！“${item.char}” 读作 ${item.pinyin}。识字成功！`);
      recordCorrectAnswer(item.char);
      awardStars(1);
      onStarsEarned(1);
    } else {
      setIsCorrect(false);
      setShakeCard(item.char);
      sound.playGentleOops();
      setMascotHint(`再听一次吧！刚才读的是 “${currentQ.target.char}”（${currentQ.target.pinyin}）。`);
      setMistakesThisRound(prev => [...prev, currentQ.target.char]);
      addMistake({
        char: currentQ.target.char,
        pinyin: currentQ.target.pinyin,
        questionType: 'LISTEN',
        userAnswer: item.char,
        correctAnswer: currentQ.target.char,
      });

      // Allow repeating sound after gentle hint
      setTimeout(() => {
        setShakeCard(null);
        sound.speak(currentQ.target.char);
      }, 700);
    }
  };

  const handleNext = () => {
    sound.playWoodblock();
    if (currentIndex < questionList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedChar(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setMascotHint('请仔细听发音哦！');
    } else {
      sound.playVictoryArpeggio();
    }
  };

  const isCompleted = currentIndex >= questionList.length - 1 && isAnswered;

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FCFAF4] border border-[#E5DAC8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="seal-stamp text-xs px-2.5 py-0.5">听觉训练</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2A2421] font-guofeng">
              听音识字阁 · {currentUnit.title}
            </h2>
          </div>
          <p className="text-xs text-[#7B6E60] font-guofeng mt-1">
            专注倾听标准普通话字音，在4张汉字卡片中准确找出对应汉字。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#544638]">
            当前进度：第 {currentIndex + 1} / 10 题
          </span>
          <span className="text-xs text-[#3F5E4D] font-bold px-2.5 py-1 rounded-lg bg-[#E8F0EA]">
            正确率：{currentIndex > 0 ? Math.round((score / (currentIndex + (isAnswered ? 1 : 0))) * 100) : 100}%
          </span>
        </div>
      </div>

      {!isCompleted && currentQ ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Audio Speaker Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF7F0] border-2 border-[#D9CABB] shadow-md text-center space-y-4 bg-xuan-paper">
            <span className="text-xs font-semibold text-[#8B7865] uppercase tracking-wider font-guofeng">
              点击铜铃再次听音
            </span>

            {/* Play Button */}
            <div className="flex justify-center">
              <button
                onClick={handlePlayVoice}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3F5E4D] to-[#2B4034] text-white flex flex-col items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              >
                <Volume2 className="w-9 h-9 group-hover:animate-bounce" />
                <span className="text-[11px] font-guofeng mt-1 text-[#E0EFE5]">播放字音</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#6C5E4E] font-guofeng">
              请根据听到的字音，在下方选出正确的汉字：
            </p>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
              {currentQ.options.map((item) => {
                const isSelected = selectedChar === item.char;
                const isTarget = item.char === currentQ.target.char;
                const isShaking = shakeCard === item.char;

                let cardStyle = 'bg-white hover:bg-[#F7F4EB] border-[#D8C7B0] text-[#2C241B] shadow-xs hover:border-[#3F5E4D]';

                if (isAnswered) {
                  if (isTarget) {
                    cardStyle = 'bg-[#FAF7E6] border-[#C69A57] text-[#2A2421] ring-3 ring-[#C69A57]/40 shadow-lg';
                  } else if (isSelected) {
                    cardStyle = 'bg-[#FCEDEA] border-[#BA3329] text-[#BA3329]';
                  } else {
                    cardStyle = 'bg-[#FAF7F0] border-[#E8DEC9] text-[#A69788] opacity-50';
                  }
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    disabled={isAnswered}
                    className={`relative p-5 rounded-3xl border-2 flex flex-col items-center justify-center min-h-[140px] transition-all cursor-pointer ${cardStyle} ${isShaking ? 'animate-wiggle' : ''}`}
                  >
                    {/* Chinese Calligraphy Character */}
                    <span className="text-5xl font-black font-guofeng">
                      {item.char}
                    </span>

                    {/* Word clue if answered */}
                    {isAnswered && isTarget && (
                      <span className="text-xs text-[#6F6051] font-mono mt-1 font-semibold">
                        {item.pinyin}
                      </span>
                    )}

                    {/* "识字成功" Seal Stamp when correct */}
                    {isAnswered && isTarget && (
                      <div className="absolute -top-3 -right-2 seal-stamp text-[10px] px-1.5 py-0.5 bg-white shadow-md animate-ink-appear">
                        识字成功
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {isAnswered && (
              <div className="pt-4 flex justify-center animate-ink-appear">
                <button
                  onClick={handleNext}
                  className="px-8 py-2.5 rounded-xl bg-[#3F5E4D] hover:bg-[#324B3D] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {currentIndex < questionList.length - 1 ? '下一题 →' : '查看本轮成绩'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Summary Card */
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-[#FAF7F0] border-2 border-[#D8C7AB] shadow-lg text-center space-y-6 bg-scroll-parchment animate-ink-appear">
          <div className="w-16 h-16 rounded-full bg-[#FAF5E6] border-2 border-[#C69A57] flex items-center justify-center mx-auto text-[#C69A57]">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="seal-stamp text-xs px-2.5 py-0.5">听音达成</span>
            <h3 className="text-2xl font-bold text-[#2A2421] font-guofeng">
              听音辨字训练完成！
            </h3>
            <p className="text-xs text-[#7B6E60]">
              完成 10 道听音题，答对：<strong className="text-[#3F5E4D] text-base">{score}</strong> / 10 题
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-[#E3DAC8] text-sm text-[#4E4133] space-y-2">
            <p className="font-semibold text-[#3F5E4D]">
              正确率：{Math.round((score / 10) * 100)}%
            </p>
            {mistakesThisRound.length > 0 ? (
              <div className="text-xs text-[#BA3329]">
                <span>需要多加练习的汉字：</span>
                <span className="font-bold font-guofeng text-sm ml-1">
                  {[...new Set(mistakesThisRound)].join('、')}
                </span>
              </div>
            ) : (
              <p className="text-xs text-[#3F5E4D]">太厉害了！耳聪目明，无一失误！</p>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={generateQuestions}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#3F5E4D] hover:bg-[#324B3D] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>再听一轮</span>
            </button>
          </div>
        </div>
      )}

      {/* Mascot Companion */}
      <ScholarMascot
        message={mascotHint}
        subMessage="小书童伴学：每个汉字的字音都是前人传承千年的音韵，仔细听，就能辨别出声母与韵母的微妙变化！"
      />
    </div>
  );
};

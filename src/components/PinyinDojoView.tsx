import React, { useState, useEffect } from 'react';
import { QianziwenUnit, CharacterItem } from '../types/qianziwen';
import { ScholarMascot } from './ScholarMascot';
import { Volume2, CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { recordCorrectAnswer, addMistake, awardStars } from '../utils/storage';

interface PinyinDojoProps {
  currentUnit: QianziwenUnit;
  onStarsEarned: (stars: number) => void;
}

type Mode = 'LOOK_SELECT' | 'LISTEN_SELECT' | 'TONE_CHALLENGE';

interface Question {
  targetChar: CharacterItem;
  promptText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

import { generateToneVariants } from '../utils/pinyin.js';

export const PinyinDojoView: React.FC<PinyinDojoProps> = ({
  currentUnit,
  onStarsEarned,
}) => {
  const [activeMode, setActiveMode] = useState<Mode>('LOOK_SELECT');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  // Generate question list based on mode
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    buildQuestions(activeMode);
    setQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
  }, [activeMode, currentUnit]);

  const buildQuestions = (mode: Mode) => {
    const list: Question[] = currentUnit.characters.map((item) => {
      let promptText = '';
      let options: string[] = [];

      if (mode === 'LOOK_SELECT') {
        promptText = `请看汉字 “${item.char}”，选择正确的拼音：`;
        const tones = generateToneVariants(item.pinyin);
        options = [...tones].sort(() => Math.random() - 0.5);
      } else if (mode === 'LISTEN_SELECT') {
        promptText = `请听标准普通话读音，选出对应的拼音：`;
        // Pick 3 random distractor pinyins from other characters
        const otherPinyins = currentUnit.characters
          .filter(c => c.id !== item.id)
          .map(c => c.pinyin);
        const distractors = otherPinyins.sort(() => Math.random() - 0.5).slice(0, 3);
        options = [item.pinyin, ...distractors].sort(() => Math.random() - 0.5);
      } else {
        // TONE_CHALLENGE
        promptText = `【声调挑战】汉字 “${item.char}” 是第几声？请选出声调正确的拼音：`;
        const tones = generateToneVariants(item.pinyin);
        options = [...tones]; // keep or shuffle
      }

      return {
        targetChar: item,
        promptText,
        options,
        correctAnswer: item.pinyin,
        explanation: `“${item.char}” 的正确读音是 【${item.pinyin}】（${item.toneNumber === 0 ? '轻声' : `第${item.toneNumber}声`}）。字义：${item.meaning}`
      };
    });

    setQuestions(list);
  };

  const currentQ = questions[questionIndex];

  // Auto-play sound for LISTEN_SELECT mode
  useEffect(() => {
    if (currentQ && activeMode === 'LISTEN_SELECT' && !isAnswered) {
      sound.speak(currentQ.targetChar.char);
    }
  }, [questionIndex, activeMode, currentQ]);

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const correct = option === currentQ.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      sound.playChime(880);
      setScore(prev => prev + 1);
      recordCorrectAnswer(currentQ.targetChar.char);
      onStarsEarned(1);
    } else {
      sound.playGentleOops();
      addMistake({
        char: currentQ.targetChar.char,
        pinyin: currentQ.targetChar.pinyin,
        questionType: 'PINYIN',
        userAnswer: option,
        correctAnswer: currentQ.correctAnswer,
      });
      // Speak the correct pronunciation
      setTimeout(() => {
        sound.speak(`答错啦，正确读音是 ${currentQ.targetChar.char}，${currentQ.correctAnswer}`);
      }, 300);
    }
  };

  const handleNext = () => {
    sound.playWoodblock();
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed round
      sound.playVictoryArpeggio();
      awardStars(2);
      onStarsEarned(2);
    }
  };

  const handleRestart = () => {
    sound.playWoodblock();
    buildQuestions(activeMode);
    setQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
  };

  const isCompleted = questionIndex >= questions.length - 1 && isAnswered;

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Dojo Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FCFAF4] border border-[#E5DAC8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="seal-stamp text-xs px-2.5 py-0.5">拼音秘境</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2A2421] font-guofeng">
              拼音修炼坊 · {currentUnit.title}
            </h2>
          </div>
          <p className="text-xs text-[#7B6E60] font-guofeng mt-1">
            看字选音、辨听音节、分清四声，夯实普通话拼音功底。
          </p>
        </div>

        {/* 3 Play Modes Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EFE8D6] rounded-xl border border-[#D8CBB6]">
          <button
            onClick={() => {
              sound.playWoodblock();
              setActiveMode('LOOK_SELECT');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeMode === 'LOOK_SELECT'
                ? 'bg-white text-[#3F5E4D] shadow-xs'
                : 'text-[#6D5D4E] hover:text-[#2A2421]'
            }`}
          >
            看字选拼音
          </button>
          <button
            onClick={() => {
              sound.playWoodblock();
              setActiveMode('LISTEN_SELECT');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeMode === 'LISTEN_SELECT'
                ? 'bg-white text-[#3F5E4D] shadow-xs'
                : 'text-[#6D5D4E] hover:text-[#2A2421]'
            }`}
          >
            听音选拼音
          </button>
          <button
            onClick={() => {
              sound.playWoodblock();
              setActiveMode('TONE_CHALLENGE');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeMode === 'TONE_CHALLENGE'
                ? 'bg-white text-[#3F5E4D] shadow-xs'
                : 'text-[#6D5D4E] hover:text-[#2A2421]'
            }`}
          >
            声调挑战
          </button>
        </div>
      </div>

      {currentQ && !isCompleted ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Question Card */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-[#FAF7F0] border-2 border-[#D9CABB] shadow-md bg-xuan-paper">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-[#7B6E60] pb-4 border-b border-[#E3DAC8]">
              <span>第 {questionIndex + 1} / {questions.length} 题</span>
              <span>得分：<strong className="text-[#3F5E4D] font-bold">{score}</strong> 分</span>
            </div>

            {/* Prompt & Target Display */}
            <div className="text-center py-6 space-y-4">
              <p className="text-sm sm:text-base font-semibold text-[#544638] font-guofeng">
                {currentQ.promptText}
              </p>

              {activeMode !== 'LISTEN_SELECT' ? (
                <div className="inline-flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white border-2 border-[#D5C6AC] shadow-sm">
                  <span className="text-6xl sm:text-7xl font-black text-[#2A2421] font-guofeng">
                    {currentQ.targetChar.char}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-4">
                  <button
                    onClick={() => sound.speak(currentQ.targetChar.char)}
                    className="w-20 h-20 rounded-full bg-[#3F5E4D] hover:bg-[#324B3D] text-white flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-8 h-8" />
                  </button>
                  <span className="text-xs text-[#7B6E60] font-guofeng">点击再次播放读音</span>
                </div>
              )}
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
              {currentQ.options.map((opt, idx) => {
                const label = ['A', 'B', 'C', 'D'][idx];
                const isSelected = selectedOption === opt;
                let btnStyle = 'bg-white hover:bg-[#F3EFE6] border-[#D8C7B0] text-[#2C241B]';

                if (isAnswered) {
                  if (opt === currentQ.correctAnswer) {
                    btnStyle = 'bg-[#EBF5EE] border-[#3F5E4D] text-[#1B4D2E] font-bold ring-2 ring-[#3F5E4D]/30';
                  } else if (isSelected) {
                    btnStyle = 'bg-[#FDF0EE] border-[#BA3329] text-[#BA3329]';
                  } else {
                    btnStyle = 'bg-[#FAF7F0] border-[#E8DEC9] text-[#A69788] opacity-60';
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between text-base sm:text-lg transition-all shadow-xs cursor-pointer font-mono ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#867563] w-5 h-5 rounded-full bg-[#EFE8D6] flex items-center justify-center">
                        {label}
                      </span>
                      <span className="font-bold tracking-wider">{opt}</span>
                    </div>

                    {isAnswered && opt === currentQ.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-[#3F5E4D]" />
                    )}
                    {isAnswered && isSelected && opt !== currentQ.correctAnswer && (
                      <XCircle className="w-5 h-5 text-[#BA3329]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback & Explanation */}
            {isAnswered && (
              <div className="mt-6 p-4 rounded-2xl bg-white border border-[#E3DAC8] space-y-2 animate-ink-appear">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold flex items-center gap-1.5 ${isCorrect ? 'text-[#3F5E4D]' : 'text-[#BA3329]'}`}>
                    {isCorrect ? '✓ 恭喜答对！太棒了！' : '✕ 还需要加油哦！'}
                  </span>
                  <button
                    onClick={() => sound.speak(currentQ.explanation)}
                    className="text-xs text-[#3F5E4D] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>听解释</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-[#5D5043] leading-relaxed">
                  {currentQ.explanation}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl bg-[#3F5E4D] hover:bg-[#324B3D] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
                  >
                    {questionIndex < questions.length - 1 ? '下一题 →' : '查看本轮成绩'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Round Summary Card */
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-[#FAF7F0] border-2 border-[#D8C7AB] shadow-lg text-center space-y-6 bg-scroll-parchment animate-ink-appear">
          <div className="w-16 h-16 rounded-full bg-[#EBF5EE] border-2 border-[#3F5E4D] flex items-center justify-center mx-auto text-[#3F5E4D]">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="seal-stamp text-xs px-2.5 py-0.5">挑战通关</span>
            <h3 className="text-2xl font-bold text-[#2A2421] font-guofeng">
              拼音修炼达成！
            </h3>
            <p className="text-xs text-[#7B6E60]">
              本轮练习本单元 8 个汉字，总分：<strong className="text-[#3F5E4D]">{score}</strong> / {questions.length}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-[#E3DAC8] text-sm text-[#4E4133]">
            {score === questions.length ? (
              <p className="font-semibold text-[#3F5E4D]">
                🎉 全对满分！你已经熟练掌握本单元汉字拼音与声调！
              </p>
            ) : (
              <p>
                完成了本轮训练，错题已经自动收录到“我的成长书卷”中，方便随时复习！
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#3F5E4D] hover:bg-[#324B3D] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>再练一轮</span>
            </button>
          </div>
        </div>
      )}

      {/* Mascot Companion */}
      <ScholarMascot
        message="在汉语拼音里，声调就像山歌的起伏：一声平、二声扬、三声拐弯、四声降！遇到不确定的字可以多听几次标准读音哦。"
        subMessage="小提示：点击右上角可以自由切换‘看字选音’、‘听音辨韵’和‘四声调挑战’三种玩法。"
      />
    </div>
  );
};

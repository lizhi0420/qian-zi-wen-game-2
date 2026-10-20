import React from 'react';
import { UserProgress } from '../types/qianziwen';
import { ScholarMascot } from './ScholarMascot';
import { 
  Award, 
  Star, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  Sparkles, 
  RotateCcw,
  Volume2
} from 'lucide-react';
import { sound } from '../utils/audio';

interface GrowthScrollProps {
  progress: UserProgress;
  onRetryMistake?: (char: string) => void;
}

export const GrowthScrollView: React.FC<GrowthScrollProps> = ({
  progress,
  onRetryMistake,
}) => {
  const accuracyRate = progress.totalAnswersCount > 0
    ? Math.round((progress.correctAnswersCount / progress.totalAnswersCount) * 100)
    : 100;

  const badges = [
    {
      id: "b1",
      name: "识字小书童",
      desc: "成功探索第 1 单元并认读 8 个核心汉字",
      unlocked: progress.completedUnits.length >= 1,
      seal: "启蒙初登"
    },
    {
      id: "b2",
      name: "拼音小达人",
      desc: "拼音正确率达到 80% 以上并掌握四声调",
      unlocked: accuracyRate >= 80 && progress.totalAnswersCount >= 5,
      seal: "音韵谐畅"
    },
    {
      id: "b3",
      name: "国学小学士",
      desc: "累计解锁 3 个单元，漫游青山古亭",
      unlocked: progress.completedUnits.length >= 3,
      seal: "博雅小学"
    },
    {
      id: "b4",
      name: "千字文小状元",
      desc: "完成全部进阶单元，通关诗句排序与朗读",
      unlocked: progress.completedUnits.length >= 5,
      seal: "金榜高中"
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FCFAF4] border border-[#E5DAC8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="seal-stamp text-xs px-2.5 py-0.5">功名卷轴</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2A2421] font-guofeng">
              我的成长书卷 · 识字进阶档案
            </h2>
          </div>
          <p className="text-xs text-[#7B6E60] font-guofeng mt-1">
            见证每一天的积累与成长，温故而知新，掌握中华汉字瑰宝。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#C69A57] bg-[#FAF5E6] px-3 py-1.5 rounded-xl border border-[#E6D7B8] flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#C69A57]" />
            <span>累计获得：★ {progress.stars} 颗星</span>
          </span>
        </div>
      </div>

      {/* Main Growth Scroll Layout */}
      <div className="max-w-4xl mx-auto relative rounded-3xl border-3 border-[#D5C6AC] bg-[#FAF7F0] p-6 sm:p-10 shadow-lg bg-scroll-parchment space-y-8">
        
        {/* Ancient Scroll Top Roller Bar */}
        <div className="h-4 bg-gradient-to-r from-[#A0886F] via-[#D8C7B0] to-[#A0886F] rounded-full shadow-inner flex items-center justify-center">
          <div className="w-32 h-1 bg-[#5A4B3A]/40 rounded-full"></div>
        </div>

        {/* 6 Key Learning Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-[#E2D6C3] text-center shadow-xs">
            <span className="text-[11px] text-[#867563] font-guofeng block mb-1">完成单元数</span>
            <span className="text-2xl font-black text-[#2A2421] font-mono tabular-nums">
              {progress.completedUnits.length}
            </span>
            <span className="text-[10px] text-[#9A8977] block mt-0.5">/ 125 单元</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E2D6C3] text-center shadow-xs">
            <span className="text-[11px] text-[#867563] font-guofeng block mb-1">已学汉字数</span>
            <span className="text-2xl font-black text-[#3F5E4D] font-mono tabular-nums">
              {progress.learnedChars.length}
            </span>
            <span className="text-[10px] text-[#9A8977] block mt-0.5">/ 1000 字</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E2D6C3] text-center shadow-xs">
            <span className="text-[11px] text-[#867563] font-guofeng block mb-1">已掌握汉字</span>
            <span className="text-2xl font-black text-[#C69A57] font-mono tabular-nums">
              {progress.masteredChars.length}
            </span>
            <span className="text-[10px] text-[#9A8977] block mt-0.5">熟练认读</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E2D6C3] text-center shadow-xs">
            <span className="text-[11px] text-[#867563] font-guofeng block mb-1">答题正确率</span>
            <span className="text-2xl font-black text-[#BA3329] font-mono tabular-nums">
              {accuracyRate}%
            </span>
            <span className="text-[10px] text-[#9A8977] block mt-0.5">答题 {progress.totalAnswersCount} 次</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E2D6C3] text-center shadow-xs">
            <span className="text-[11px] text-[#867563] font-guofeng block mb-1">连续学习天数</span>
            <span className="text-2xl font-black text-[#2A2421] font-mono tabular-nums">
              {progress.streakDays}
            </span>
            <span className="text-[10px] text-[#9A8977] block mt-0.5">天保持习惯</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E2D6C3] text-center shadow-xs">
            <span className="text-[11px] text-[#867563] font-guofeng block mb-1">金星嘉奖</span>
            <span className="text-2xl font-black text-[#C69A57] font-mono tabular-nums">
              ★ {progress.stars}
            </span>
            <span className="text-[10px] text-[#9A8977] block mt-0.5">星星总数</span>
          </div>
        </div>

        {/* Honors & Seals Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#2A2421] font-guofeng flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C69A57]" />
              <span>国风荣誉印章与徽章</span>
            </h3>
            <span className="text-xs text-[#7B6E60]">
              已获得 {badges.filter(b => b.unlocked).length} / 4 枚印章
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  b.unlocked
                    ? 'bg-white border-[#C69A57] shadow-sm'
                    : 'bg-[#F2ECE0]/60 border-[#D8CABB] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      b.unlocked ? 'seal-stamp bg-white' : 'border border-[#C8BAA6] text-[#A2917F]'
                    }`}>
                      {b.seal}
                    </span>
                    {b.unlocked && <Sparkles className="w-4 h-4 text-[#C69A57]" />}
                  </div>

                  <h4 className="text-base font-bold text-[#2A2421] font-guofeng">
                    {b.name}
                  </h4>
                  <p className="text-xs text-[#6F6050] font-guofeng mt-1 leading-relaxed">
                    {b.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#EAE0CF] text-[11px] text-[#8A7968]">
                  {b.unlocked ? '✓ 已达成' : '尚未解锁'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mistakes Review Notebook */}
        <div className="space-y-3 pt-4 border-t border-[#E3DAC8]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#2A2421] font-guofeng flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#BA3329]" />
              <span>错题温故知新本</span>
            </h3>
            <span className="text-xs text-[#7B6E60]">
              需复习字数：{progress.mistakes.length} 个
            </span>
          </div>

          {progress.mistakes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {progress.mistakes.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-white border border-[#E5DAC8] shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded-xl bg-[#FAF7F0] border border-[#D5C6AE] flex flex-col items-center justify-center">
                      <span className="text-[10px] font-mono text-[#8C7B6B]">{m.pinyin}</span>
                      <span className="text-2xl font-black text-[#2A2421] font-guofeng">{m.char}</span>
                    </div>

                    <div className="text-xs space-y-0.5">
                      <span className="text-[#847363]">
                        题型：{m.questionType === 'PINYIN' ? '看字辨音' : '听音识字'}
                      </span>
                      <p className="text-[#BA3329]">
                        误选：{m.userAnswer} · 正确：<strong>{m.correctAnswer}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sound.playWoodblock();
                      sound.speak(`${m.char}。读作：${m.correctAnswer}`);
                      if (onRetryMistake) onRetryMistake(m.char);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F0E6D0] hover:bg-[#E5D7BC] text-[#3D2F22] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>温习</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white/70 border border-[#E3DAC8] text-center text-xs text-[#5D5043] font-guofeng">
              🎉 暂无错题！小朋友非常细心，请继续保持哦！
            </div>
          )}
        </div>

        {/* Ancient Scroll Bottom Roller Bar */}
        <div className="h-4 bg-gradient-to-r from-[#A0886F] via-[#D8C7B0] to-[#A0886F] rounded-full shadow-inner flex items-center justify-center">
          <div className="w-32 h-1 bg-[#5A4B3A]/40 rounded-full"></div>
        </div>

      </div>

      {/* Mascot Companion */}
      <ScholarMascot
        message="学而时习之，不亦说乎！每当遇到错题不要气馁，在错题本里点击‘温习’多听几次正确发音，很快就能完全掌握啦！"
        subMessage="小书童伴学：坚持每天学习，你的成长卷轴将会越来越长，最终写就属于你的千字名篇！"
      />
    </div>
  );
};

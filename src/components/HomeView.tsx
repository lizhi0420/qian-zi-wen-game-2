import React from 'react';
import { ViewTab, QianziwenUnit } from '../types/qianziwen';
import { ScholarMascot } from './ScholarMascot';
import { 
  BookOpen, 
  Volume2, 
  Headphones, 
  ArrowUpDown, 
  FileText, 
  MapPin, 
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HomeViewProps {
  onSelectTab: (tab: ViewTab) => void;
  currentUnit: QianziwenUnit;
  stars: number;
  completedUnitsCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  currentUnit,
  stars,
  completedUnitsCount,
}) => {
  const features = [
    {
      tab: 'LITERACY' as ViewTab,
      title: '千字文识字馆',
      subtitle: '8字图文 · 释义拼读',
      icon: BookOpen,
      accent: 'from-[#EBF3ED] to-[#FAF7F0]',
      border: 'border-[#CADBCF]',
      tag: '核心认字',
      highlight: '含汉字卡、部首释义与适龄组词'
    },
    {
      tab: 'PINYIN' as ViewTab,
      title: '拼音修炼坊',
      subtitle: '拼读闯关 · 声调挑战',
      icon: Volume2,
      accent: 'from-[#FDF4E7] to-[#FAF7F0]',
      border: 'border-[#EAD5B8]',
      tag: '拼读训练',
      highlight: '看字选音、听音辨韵、四声辨调'
    },
    {
      tab: 'LISTEN_IDENTIFY' as ViewTab,
      title: '听音识字阁',
      subtitle: '辨音点字 · 听觉训练',
      icon: Headphones,
      accent: 'from-[#F9EFEA] to-[#FAF7F0]',
      border: 'border-[#ECCBC1]',
      tag: '听音辨字',
      highlight: '标准普通话发音，辨别形近字'
    },
    {
      tab: 'POETRY_SORT' as ViewTab,
      title: '诗句排序坊',
      subtitle: '四字重组 · 诗韵复原',
      icon: ArrowUpDown,
      accent: 'from-[#F5EFE7] to-[#FAF7F0]',
      border: 'border-[#DFD2C2]',
      tag: '韵律排序',
      highlight: '打乱字卡重排，感悟四言古韵'
    },
    {
      tab: 'READING_HALL' as ViewTab,
      title: '千字文朗读堂',
      subtitle: '古籍翻页 · 逐字点读',
      icon: FileText,
      accent: 'from-[#F0F4E8] to-[#FAF7F0]',
      border: 'border-[#D4E0BF]',
      tag: '跟读吟诵',
      highlight: '高亮逐字发音，变速与跟读练习'
    },
    {
      tab: 'ADVENTURE_MAP' as ViewTab,
      title: '国风闯关地图',
      subtitle: '125单元 · 山水长卷',
      icon: MapPin,
      accent: 'from-[#F4EBF6] to-[#FAF7F0]',
      border: 'border-[#E1CCE5]',
      tag: '闯关进阶',
      highlight: '竹林书院至藏书阁，逐步通关'
    },
    {
      tab: 'GROWTH_SCROLL' as ViewTab,
      title: '我的成长书卷',
      subtitle: '识字档案 · 荣誉印章',
      icon: Award,
      accent: 'from-[#F9F7E8] to-[#FAF7F0]',
      border: 'border-[#E9DEAB]',
      tag: '复习记录',
      highlight: '记录掌握字数、错题本与成就'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Hero Landscape Card */}
      <section className="relative overflow-hidden rounded-3xl border border-[#DED4C0] shadow-md bg-[#FAF7F0]">
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src="/assets/images/qianziwen_home_landscape_1792480197606.jpg"
            alt="国风山水书院"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F0] via-transparent to-black/20" />
          
          {/* Floating Hero Info */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 max-w-lg bg-[#FAF7F0]/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-[#E3DAC8] shadow-sm">
            <span className="text-xs font-semibold text-[#BA3329] tracking-widest font-guofeng uppercase">
              蒙学经典 · 启蒙益智
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2A2421] font-guofeng mt-1 tracking-wide">
              千字文·国风识字奇遇记
            </h1>
            <p className="text-sm sm:text-base text-[#685A4C] font-guofeng mt-1.5">
              一字一世界，一画一诗篇。读千字古韵，识中华汉字。
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-[#E8DEC9] text-xs text-[#5D5043]">
              <span className="font-semibold text-[#3F5E4D]">当前进度：第 {currentUnit.unitNumber} / 125 单元</span>
              <span>·</span>
              <span>已获星星：<strong className="text-[#C69A57]">★ {stars}</strong></span>
              <span>·</span>
              <span>已通关：<strong>{completedUnitsCount} 个景点</strong></span>
            </div>
          </div>

          {/* Quick CTA to start current unit learning */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
            <button
              onClick={() => {
                sound.playVictoryArpeggio();
                onSelectTab('LITERACY');
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#3F5E4D] hover:bg-[#324B3D] text-[#FCFBF7] text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer font-guofeng"
            >
              <span>开启第 {currentUnit.unitNumber} 单元识字</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Companion Message */}
      <ScholarMascot
        message={`欢迎来到《千字文·国风识字奇遇记》！今天我们一起探寻第 ${currentUnit.unitNumber} 单元“${currentUnit.phrase1}，${currentUnit.phrase2}”。一起去识字馆认字、去朗读堂诵读吧！`}
        subMessage="点击任意卡片即可进入对应的修炼玩法，边玩游戏边认汉字和拼音！"
      />

      {/* Main Functional Portals Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#2A2421] font-guofeng flex items-center gap-2">
            <span className="w-2 h-4 bg-[#3F5E4D] rounded-full inline-block"></span>
            <span>国风修炼场</span>
          </h2>
          <span className="text-xs text-[#7B6E60]">选择玩法开启今天的趣味汉字学习</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.tab}
                onClick={() => {
                  sound.playWoodblock();
                  onSelectTab(feat.tab);
                }}
                className={`relative text-left p-4 sm:p-5 rounded-2xl border ${feat.border} bg-gradient-to-br ${feat.accent} hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-white/80 border border-white/60 shadow-xs text-[#3F5E4D] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-[#7D6B5A] px-2 py-0.5 rounded-md bg-white/60 border border-[#E5DAC8]">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#2A2421] font-guofeng group-hover:text-[#3F5E4D] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#6F6152] font-guofeng mt-0.5">
                    {feat.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8DEC9]/60 flex items-center justify-between text-xs text-[#827161]">
                  <span className="text-[11px] truncate max-w-[180px]">{feat.highlight}</span>
                  <ChevronRight className="w-4 h-4 text-[#A89886] group-hover:text-[#3F5E4D] group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

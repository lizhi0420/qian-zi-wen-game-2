import React from 'react';
import { QianziwenUnit, ViewTab } from '../types/qianziwen';
import { ScholarMascot } from './ScholarMascot';
import { Lock, CheckCircle2, Star, Sparkles, MapPin, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface AdventureMapProps {
  allUnits: QianziwenUnit[];
  currentUnit: QianziwenUnit;
  completedUnits: number[];
  onSelectUnit: (unit: QianziwenUnit) => void;
  onNavigateTab: (tab: ViewTab) => void;
}

export const AdventureMapView: React.FC<AdventureMapProps> = ({
  allUnits,
  currentUnit,
  completedUnits,
  onSelectUnit,
  onNavigateTab,
}) => {
  const mapLandmarks = [
    {
      unitId: 1,
      name: "竹林书院",
      desc: "天地初开 · 启蒙第一课",
      phrase: "天地玄黄，宇宙洪荒",
      badge: "启蒙圣地",
      color: "border-[#3F5E4D] bg-[#EAF2ED]"
    },
    {
      unitId: 2,
      name: "桃花溪谷",
      desc: "日月星辰 · 众星罗布",
      phrase: "日月盈昃，辰宿列张",
      badge: "星汉长卷",
      color: "border-[#D98880] bg-[#FDF0EE]"
    },
    {
      unitId: 3,
      name: "青山古亭",
      desc: "四时寒暑 · 岁时收藏",
      phrase: "寒来暑往，秋收冬藏",
      badge: "四时佳境",
      color: "border-[#58808C] bg-[#EEF5F8]"
    },
    {
      unitId: 4,
      name: "云海仙桥",
      desc: "律历调阳 · 音律谐和",
      phrase: "闰余成岁，律吕调阳",
      badge: "律吕仙音",
      color: "border-[#C69A57] bg-[#FAF5E6]"
    },
    {
      unitId: 5,
      name: "荷塘月色",
      desc: "云雨霜雪 · 润泽万物",
      phrase: "云腾致雨，露结为霜",
      badge: "水泽清辉",
      color: "border-[#7C6FA0] bg-[#F4F0FA]"
    },
    {
      unitId: 6,
      name: "千字文藏书阁",
      desc: "金玉良材 · 宝剑明珠 (第6-125卷)",
      phrase: "金生丽水，玉出昆冈...",
      badge: "博雅宝阁",
      color: "border-[#8F7D6B] bg-[#F5EFE8]"
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FCFAF4] border border-[#E5DAC8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="seal-stamp text-xs px-2.5 py-0.5">山水长卷</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2A2421] font-guofeng">
              国风闯关地图 · 千字文万里云途
            </h2>
          </div>
          <p className="text-xs text-[#7B6E60] font-guofeng mt-1">
            沿水彩山水画卷漫游，依次解锁书院、溪谷、古亭与藏书阁，收获金星与学士印章！
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#4F4133] font-semibold">
            已通关：{completedUnits.length} / 125 单元
          </span>
        </div>
      </div>

      {/* Panoramic Scenic Map Canvas */}
      <div className="relative rounded-3xl overflow-x-auto border-2 border-[#D8C7AB] shadow-md bg-[#FAF7F0] p-6 bg-xuan-paper">
        <div className="min-w-[850px] relative py-8 px-4">
          
          {/* Ancient River Pathway / Trail line */}
          <div className="absolute top-1/2 left-10 right-10 h-3 bg-gradient-to-r from-[#D5E5DA] via-[#F3E3D0] to-[#E3EAF2] rounded-full -translate-y-1/2 -z-0 opacity-80 border-t border-b border-[#C8BEAA]"></div>

          {/* Landmarks along the trail */}
          <div className="relative z-10 flex items-center justify-between gap-6">
            {mapLandmarks.map((lm, idx) => {
              const unitData = allUnits.find(u => u.id === lm.unitId);
              const isUnlocked = completedUnits.includes(lm.unitId) || lm.unitId === 1 || (completedUnits.includes(lm.unitId - 1));
              const isCurrent = currentUnit.id === lm.unitId;
              const isFinished = completedUnits.includes(lm.unitId);

              return (
                <div key={lm.name} className="flex flex-col items-center max-w-[140px] text-center">
                  
                  {/* Step Node Button */}
                  <button
                    onClick={() => {
                      if (!isUnlocked) {
                        sound.playGentleOops();
                        sound.speak(`请先完成前面单元的修炼，才能解锁 ${lm.name} 关卡哦！`);
                        return;
                      }
                      sound.playWoodblock();
                      if (unitData) onSelectUnit(unitData);
                      sound.speak(`进入${lm.name}：${lm.phrase}`);
                    }}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-3 flex flex-col items-center justify-center p-2 transition-all shadow-md cursor-pointer ${
                      isCurrent
                        ? `${lm.color} ring-4 ring-[#C69A57] scale-110 shadow-xl`
                        : isUnlocked
                        ? `${lm.color} hover:scale-105`
                        : 'bg-[#EAE4D5] border-[#CEC4B0] text-[#9A8D7B] opacity-75'
                    }`}
                  >
                    {/* Landmark Number Badge */}
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#D5C6AE] shadow-xs text-[#2A2421]">
                      第 {idx + 1} 站
                    </span>

                    {/* Icon or Status */}
                    {isFinished ? (
                      <CheckCircle2 className="w-7 h-7 text-[#3F5E4D]" />
                    ) : isUnlocked ? (
                      <MapPin className="w-7 h-7 text-[#C69A57]" />
                    ) : (
                      <Lock className="w-6 h-6 text-[#9E907E]" />
                    )}

                    <span className="text-xs font-bold text-[#2A2421] font-guofeng mt-1 truncate max-w-full">
                      {lm.name}
                    </span>

                    {/* Stars */}
                    {isUnlocked && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <Star className="w-2.5 h-2.5 fill-[#C69A57] text-[#C69A57]" />
                        <Star className="w-2.5 h-2.5 fill-[#C69A57] text-[#C69A57]" />
                        <Star className={`w-2.5 h-2.5 ${isFinished ? 'fill-[#C69A57] text-[#C69A57]' : 'text-[#D0C3AD]'}`} />
                      </div>
                    )}
                  </button>

                  {/* Caption & Verse */}
                  <div className="mt-3 space-y-0.5">
                    <span className="seal-stamp text-[9px] px-1 py-0.2">
                      {lm.badge}
                    </span>
                    <p className="text-[11px] font-bold text-[#2A2421] font-guofeng line-clamp-1 mt-1">
                      {lm.phrase}
                    </p>
                    <p className="text-[10px] text-[#7E6F5E] line-clamp-1">
                      {lm.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Current Selected Unit Quick Action Panel */}
      <div className="p-6 rounded-3xl bg-[#FAF7F0] border-2 border-[#D8C7AB] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-semibold text-[#BA3329] font-guofeng">
            当前探索景点：{currentUnit.locationName}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#2A2421] font-guofeng">
            第 {currentUnit.unitNumber} 单元 · {currentUnit.fullText}
          </h3>
          <p className="text-xs sm:text-sm text-[#6C5E4E] max-w-xl">
            {currentUnit.meaning}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            onClick={() => {
              sound.playWoodblock();
              onNavigateTab('LITERACY');
            }}
            className="px-4 py-2.5 rounded-xl bg-[#3F5E4D] hover:bg-[#324B3D] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            进入识字馆
          </button>

          <button
            onClick={() => {
              sound.playWoodblock();
              onNavigateTab('PINYIN');
            }}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F2EDE1] border border-[#D5C6AE] text-[#3D3024] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            拼音修炼
          </button>

          <button
            onClick={() => {
              sound.playWoodblock();
              onNavigateTab('LISTEN_IDENTIFY');
            }}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F2EDE1] border border-[#D5C6AE] text-[#3D3024] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            听音辨字
          </button>
        </div>
      </div>

      {/* Mascot Companion */}
      <ScholarMascot
        message="千里之行，始于足下！我们从竹林书院出发，每掌握一个单元的汉字与拼音，就能解锁山水长卷上的下一处名胜，最终通关百卷藏书阁！"
        subMessage="小书童伴学：每个景点都有3颗金色星星等你赢取，加油积攒星星解锁更多国学徽章吧！"
      />
    </div>
  );
};

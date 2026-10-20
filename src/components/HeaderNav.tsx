import React from 'react';
import { ViewTab } from '../types/qianziwen';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderNavProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  stars: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentTab,
  onSelectTab,
  stars,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E3DAC9] shadow-[0_2px_12px_rgba(60,45,30,0.04)] px-4 sm:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text element Brand wordmark */}
        <button
          onClick={() => {
            sound.playWoodblock();
            onSelectTab('HOME');
          }}
          className="text-lg sm:text-xl font-bold tracking-wider text-[#2A2421] font-guofeng whitespace-nowrap shrink-0 hover:text-[#3F5E4D] transition-colors flex items-center gap-2 group text-left cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#BA3329]/90 inline-block shadow-sm"></span>
          <span>千字文·国风识字奇遇记</span>
        </button>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-[#5E5248]">
          <button
            onClick={() => {
              sound.playWoodblock();
              onSelectTab('LITERACY');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors relative cursor-pointer ${
              currentTab === 'LITERACY' ? 'text-[#3F5E4D] font-bold' : 'hover:text-[#2A2421]'
            }`}
          >
            识字馆
            {currentTab === 'LITERACY' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3F5E4D] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playWoodblock();
              onSelectTab('PINYIN');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors relative cursor-pointer ${
              currentTab === 'PINYIN' ? 'text-[#3F5E4D] font-bold' : 'hover:text-[#2A2421]'
            }`}
          >
            拼音坊
            {currentTab === 'PINYIN' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3F5E4D] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playWoodblock();
              onSelectTab('LISTEN_IDENTIFY');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors relative cursor-pointer ${
              currentTab === 'LISTEN_IDENTIFY' ? 'text-[#3F5E4D] font-bold' : 'hover:text-[#2A2421]'
            }`}
          >
            听音阁
            {currentTab === 'LISTEN_IDENTIFY' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3F5E4D] rounded-full" />
            )}
          </button>


          <button
            onClick={() => {
              sound.playWoodblock();
              onSelectTab('POETRY_SORT');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors relative cursor-pointer ${
              currentTab === 'POETRY_SORT' ? 'text-[#3F5E4D] font-bold' : 'hover:text-[#2A2421]'
            }`}
          >
            排序坊
            {currentTab === 'POETRY_SORT' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3F5E4D] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playWoodblock();
              onSelectTab('READING_HALL');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors relative cursor-pointer ${
              currentTab === 'READING_HALL' ? 'text-[#3F5E4D] font-bold' : 'hover:text-[#2A2421]'
            }`}
          >
            朗读堂
            {currentTab === 'READING_HALL' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3F5E4D] rounded-full" />
            )}
          </button>


          <button
            onClick={() => {
              sound.playWoodblock();
              onSelectTab('ADVENTURE_MAP');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors relative cursor-pointer ${
              currentTab === 'ADVENTURE_MAP' ? 'text-[#3F5E4D] font-bold' : 'hover:text-[#2A2421]'
            }`}
          >
            闯关地图
            {currentTab === 'ADVENTURE_MAP' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3F5E4D] rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? '开启声音' : '静音'}
            title={isMuted ? '点击开启声音' : '点击静音'}
            className="p-2 rounded-lg text-[#6E6053] hover:text-[#2A2421] hover:bg-[#EFE8D6] transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-700" /> : <Volume2 className="w-4 h-4 text-[#3F5E4D]" />}
          </button>

          <button
            onClick={() => {
              sound.playWoodblock();
              onSelectTab('GROWTH_SCROLL');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#3D2C1D] bg-[#F1E8D2] border border-[#D8C7A7] rounded-lg hover:bg-[#EAE0C5] transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C69A57]" />
            <span>成长书卷</span>
            <span className="text-[#BA3329] font-bold ml-1">★ {stars}</span>
          </button>
        </div>

      </div>
    </header>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useLayoutEffect } from 'react';
import { ViewTab, QianziwenUnit, UserProgress } from './types/qianziwen';
import { UNITS_DATA } from './data/qianziwenData';
import { loadProgress, saveProgress, unlockUnit, awardStars } from './utils/storage';
import { sound } from './utils/audio';

// Components
import { HeaderNav } from './components/HeaderNav';
import { HomeView } from './components/HomeView';
import { LiteracyView } from './components/LiteracyView';
import { PinyinDojoView } from './components/PinyinDojoView';
import { ListenIdentifyView } from './components/ListenIdentifyView';
import { PoetrySortView } from './components/PoetrySortView';
import { ReadingHallView } from './components/ReadingHallView';
import { AdventureMapView } from './components/AdventureMapView';
import { GrowthScrollView } from './components/GrowthScrollView';

// Mobile bottom bar icons
import { BookOpen, Volume2, Headphones, MapPin, Home } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('HOME');
  const [currentUnit, setCurrentUnit] = useState<QianziwenUnit>(UNITS_DATA[0]);
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [isMuted, setIsMuted] = useState(false);

  useLayoutEffect(() => {
    sound.stopSpeech();
  }, [currentTab, currentUnit.id]);

  // Sync mute state with sound engine
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.isMuted = next;
    if (!next) {
      sound.playWoodblock();
    }
  };

  const handleSelectUnit = (unit: QianziwenUnit) => {
    setCurrentUnit(unit);
  };

  const handleCharacterLearned = (char: string) => {
    setProgress((prev) => {
      const nextLearned = prev.learnedChars.includes(char)
        ? prev.learnedChars
        : [...prev.learnedChars, char];
      const updated: UserProgress = { ...prev, learnedChars: nextLearned };
      saveProgress(updated);
      return updated;
    });
  };

  const handleStarsEarned = (earned: number) => {
    setProgress((prev) => {
      const updated: UserProgress = { ...prev, stars: prev.stars + earned };
      saveProgress(updated);
      return updated;
    });
  };

  const handleRetryMistake = (char: string) => {
    // Find unit containing this character
    const targetUnit = UNITS_DATA.find((u) => u.characters.some((c) => c.char === char));
    if (targetUnit) {
      setCurrentUnit(targetUnit);
      setCurrentTab('LITERACY');
    }
  };

  return (
    <div className="relative isolate min-h-screen bg-[#F6F2E9] text-[#2C241B] flex flex-col font-sans selection:bg-[#E8DEC9]">
      {['LITERACY', 'PINYIN', 'LISTEN_IDENTIFY', 'POETRY_SORT', 'READING_HALL'].includes(currentTab) && (
        <div key={currentUnit.id} aria-hidden="true" className="lesson-page-backdrop"
          style={{ backgroundImage: `linear-gradient(rgba(246,242,233,.78), rgba(246,242,233,.88)), url("${currentUnit.illustration}")` }} />
      )}
      {/* Top Bar strictly following Top Bar Contract */}
      <HeaderNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        stars={progress.stars}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Container - Desktop baseline 1440px wide, max-w-7xl with proper padding */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 lg:pb-10">
        {currentTab === 'HOME' && (
          <HomeView
            onSelectTab={setCurrentTab}
            currentUnit={currentUnit}
            stars={progress.stars}
            completedUnitsCount={progress.completedUnits.length}
          />
        )}

        {currentTab === 'LITERACY' && (
          <LiteracyView
            currentUnit={currentUnit}
            allUnits={UNITS_DATA}
            onSelectUnit={handleSelectUnit}
            onCharacterLearned={handleCharacterLearned}
          />
        )}

        {currentTab === 'PINYIN' && (
          <PinyinDojoView
            currentUnit={currentUnit}
            onStarsEarned={handleStarsEarned}
          />
        )}

        {currentTab === 'LISTEN_IDENTIFY' && (
          <ListenIdentifyView
            currentUnit={currentUnit}
            onStarsEarned={handleStarsEarned}
          />
        )}

        {currentTab === 'POETRY_SORT' && (
          <PoetrySortView
            currentUnit={currentUnit}
            onStarsEarned={handleStarsEarned}
          />
        )}

        {currentTab === 'READING_HALL' && (
          <ReadingHallView
            currentUnit={currentUnit}
            allUnits={UNITS_DATA}
            onSelectUnit={handleSelectUnit}
          />
        )}

        {currentTab === 'ADVENTURE_MAP' && (
          <AdventureMapView
            allUnits={UNITS_DATA}
            currentUnit={currentUnit}
            completedUnits={progress.completedUnits}
            onSelectUnit={handleSelectUnit}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'GROWTH_SCROLL' && (
          <GrowthScrollView
            progress={progress}
            onRetryMistake={handleRetryMistake}
          />
        )}
      </main>

      {/* Mobile Sticky Navigation Dock (Cap <= 15% mobile viewport height) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-t border-[#E3DAC8] px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => {
            sound.playWoodblock();
            setCurrentTab('HOME');
          }}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-guofeng ${
            currentTab === 'HOME' ? 'text-[#3F5E4D] font-bold' : 'text-[#7B6E60]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>首页</span>
        </button>

        <button
          onClick={() => {
            sound.playWoodblock();
            setCurrentTab('LITERACY');
          }}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-guofeng ${
            currentTab === 'LITERACY' ? 'text-[#3F5E4D] font-bold' : 'text-[#7B6E60]'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>识字</span>
        </button>

        <button
          onClick={() => {
            sound.playWoodblock();
            setCurrentTab('PINYIN');
          }}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-guofeng ${
            currentTab === 'PINYIN' ? 'text-[#3F5E4D] font-bold' : 'text-[#7B6E60]'
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span>拼音</span>
        </button>

        <button
          onClick={() => {
            sound.playWoodblock();
            setCurrentTab('LISTEN_IDENTIFY');
          }}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-guofeng ${
            currentTab === 'LISTEN_IDENTIFY' ? 'text-[#3F5E4D] font-bold' : 'text-[#7B6E60]'
          }`}
        >
          <Headphones className="w-5 h-5" />
          <span>听音</span>
        </button>


        <button
          onClick={() => {
            sound.playWoodblock();
            setCurrentTab('ADVENTURE_MAP');
          }}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-guofeng ${
            currentTab === 'ADVENTURE_MAP' ? 'text-[#3F5E4D] font-bold' : 'text-[#7B6E60]'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>地图</span>
        </button>
      </nav>
    </div>
  );
}

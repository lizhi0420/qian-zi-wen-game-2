import React from 'react';
import { Volume2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface ScholarMascotProps {
  message: string;
  subMessage?: string;
  onVoiceClick?: () => void;
  className?: string;
}

export const ScholarMascot: React.FC<ScholarMascotProps> = ({
  message,
  subMessage,
  onVoiceClick,
  className = '',
}) => {
  const handleSpeak = () => {
    sound.playWoodblock();
    sound.speak(message);
    if (onVoiceClick) onVoiceClick();
  };

  return (
    <div className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-[#FCFAF4] border border-[#E3DAC8] shadow-sm ${className}`}>
      {/* Mascot Avatar */}
      <div 
        onClick={handleSpeak}
        title="点击小书童朗读提示"
        className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-[#C8BEA8] shadow-sm cursor-pointer hover:scale-105 transition-transform"
      >
        <img
          src="/assets/images/scholar_child_mascot_1792480197625.jpg"
          alt="国风小书童"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Speech Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#3F5E4D] font-guofeng tracking-wide">
            伴读小书童
          </span>
          <button
            onClick={handleSpeak}
            className="text-xs text-[#827161] hover:text-[#3F5E4D] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>听读</span>
          </button>
        </div>
        <p className="text-sm font-medium text-[#2C241B] mt-0.5 leading-relaxed font-guofeng">
          {message}
        </p>
        {subMessage && (
          <p className="text-xs text-[#7B6E60] mt-1 leading-normal">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );
};

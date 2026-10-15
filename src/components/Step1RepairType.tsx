import React from 'react';
import { Paintbrush, Hammer, Sparkles } from 'lucide-react';
import { RepairType } from '../types/quiz';
import { REPAIR_RATES, formatUAH } from '../utils/calculator';
import { hapticImpact } from '../utils/telegram';

interface Step1Props {
  value: RepairType;
  onChange: (val: RepairType) => void;
}

const ICONS: Record<RepairType, React.ReactNode> = {
  cosmetic: <Paintbrush className="w-5 h-5" />,
  capital: <Hammer className="w-5 h-5" />,
  designer: <Sparkles className="w-5 h-5" />,
};

export const Step1RepairType: React.FC<Step1Props> = ({ value, onChange }) => {
  const handleSelect = (key: RepairType) => {
    hapticImpact('light');
    onChange(key);
  };

  const options: RepairType[] = ['cosmetic', 'capital', 'designer'];

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Оберіть тип ремонту
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Базова ставка розраховується за 1 м² житлової площі
        </p>
      </div>

      <div className="space-y-3">
        {options.map((key) => {
          const item = REPAIR_RATES[key];
          const isSelected = value === key;

          return (
            <div
              key={key}
              onClick={() => handleSelect(key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(key)}
              className={`relative flex items-start gap-3.5 rounded-2xl p-4 cursor-pointer transition-all duration-200 select-none active:scale-[0.985] ${
                isSelected
                  ? 'border border-amber-500/40 bg-gradient-to-b from-amber-500/[0.12] to-amber-500/[0.02] shadow-[0_0_20px_-3px_rgba(245,158,11,0.2)]'
                  : 'bg-[#13161C]/60 backdrop-blur-lg border border-white/[0.07] hover:border-white/[0.15]'
              }`}
            >
              {/* Icon Capsule */}
              <div
                className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                    : 'bg-white/[0.04] text-neutral-400 border-white/[0.06]'
                }`}
              >
                {ICONS[key]}
              </div>

              {/* Text Information */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm text-white">
                    {item.title}
                  </h3>
                </div>
                <div className="mt-0.5">
                  <span className="text-amber-400 font-bold text-sm tracking-tight">
                    {formatUAH(item.pricePerM2)}/м²
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* iOS Liquid Radio Indicator */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                  isSelected
                    ? 'border-2 border-amber-400 bg-amber-500/10'
                    : 'border border-white/20 bg-white/[0.03]'
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

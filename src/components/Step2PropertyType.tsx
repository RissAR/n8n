import React from 'react';
import { Building2, Home } from 'lucide-react';
import { PropertyType } from '../types/quiz';
import { PROPERTY_MULTIPLIERS } from '../utils/calculator';
import { hapticImpact } from '../utils/telegram';

interface Step2Props {
  value: PropertyType;
  onChange: (val: PropertyType) => void;
}

const ICONS: Record<PropertyType, React.ReactNode> = {
  new: <Building2 className="w-5 h-5" />,
  secondary: <Home className="w-5 h-5" />,
};

export const Step2PropertyType: React.FC<Step2Props> = ({ value, onChange }) => {
  const handleSelect = (key: PropertyType) => {
    hapticImpact('light');
    onChange(key);
  };

  const options: PropertyType[] = ['new', 'secondary'];

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Стан та тип об'єкта
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Вторинне житло потребує додаткового демонтажу та підготовки стін
        </p>
      </div>

      <div className="space-y-3">
        {options.map((key) => {
          const item = PROPERTY_MULTIPLIERS[key];
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
              {/* Icon Container */}
              <div
                className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                    : 'bg-white/[0.04] text-neutral-400 border-white/[0.06]'
                }`}
              >
                {ICONS[key]}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm text-white">
                    {item.title}
                  </h3>
                </div>
                <div className="mt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Коефіцієнт x{item.multiplier.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Selection Indicator */}
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

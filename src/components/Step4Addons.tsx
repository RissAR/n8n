import React from 'react';
import { Palette, Zap, Truck, Check } from 'lucide-react';
import { AddonKey } from '../types/quiz';
import { ADDONS_DATA, formatUAH } from '../utils/calculator';
import { hapticImpact } from '../utils/telegram';

interface Step4Props {
  value: AddonKey[];
  onChange: (val: AddonKey[]) => void;
}

const ICONS: Record<AddonKey, React.ReactNode> = {
  design_project: <Palette className="w-5 h-5" />,
  electric_plumbing: <Zap className="w-5 h-5" />,
  materials_delivery: <Truck className="w-5 h-5" />,
};

export const Step4Addons: React.FC<Step4Props> = ({ value, onChange }) => {
  const toggleAddon = (key: AddonKey) => {
    hapticImpact('light');
    if (value.includes(key)) {
      onChange(value.filter((k) => k !== key));
    } else {
      onChange([...value, key]);
    }
  };

  const options: AddonKey[] = ['design_project', 'electric_plumbing', 'materials_delivery'];

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Додаткові опції
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Оберіть необхідні супутні послуги (можна обрати кілька або пропустити)
        </p>
      </div>

      <div className="space-y-3">
        {options.map((key) => {
          const item = ADDONS_DATA[key];
          const isSelected = value.includes(key);

          return (
            <div
              key={key}
              onClick={() => toggleAddon(key)}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && toggleAddon(key)}
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
                <div className="mt-1.5">
                  <span className="text-amber-300 font-medium text-xs bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 inline-block">
                    +{formatUAH(item.price)}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* iOS Checkbox Box */}
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                  isSelected
                    ? 'bg-gradient-to-tr from-[#D97706] to-[#F59E0B] text-white shadow-sm border border-amber-400'
                    : 'border border-white/20 bg-white/[0.03]'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

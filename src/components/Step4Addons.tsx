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
  design_project: <Palette className="w-5 h-5 text-[#F59E0B]" />,
  electric_plumbing: <Zap className="w-5 h-5 text-[#F59E0B]" />,
  materials_delivery: <Truck className="w-5 h-5 text-[#F59E0B]" />,
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
        <h2 className="text-xl font-bold text-[#F3F4F6] tracking-tight">
          Додаткові опції
        </h2>
        <p className="text-sm text-[#9CA3AF] mt-1">
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
              className={`relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 select-none ${
                isSelected
                  ? 'bg-[#1A1F24] border-2 border-[#F59E0B] shadow-[0_4px_20px_rgba(217,119,6,0.18)]'
                  : 'bg-[#1A1F24]/80 border border-[#2D343B] hover:border-[#3E4750] active:scale-[0.99]'
              }`}
            >
              {/* Icon Container */}
              <div
                className={`p-2.5 rounded-lg border transition-colors ${
                  isSelected
                    ? 'bg-[#D97706]/20 border-[#F59E0B]/50'
                    : 'bg-[#232A31] border-[#2D343B]'
                }`}
              >
                {ICONS[key]}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-base text-[#F3F4F6]">
                    {item.title}
                  </h3>
                </div>
                <div className="mt-1">
                  <span className="text-[#FBBF24] font-bold text-sm">
                    +{formatUAH(item.price)}
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Checkbox Box */}
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-gradient-to-tr from-[#D97706] to-[#F59E0B] text-white shadow-sm'
                    : 'border border-[#3E4750] bg-[#121518]'
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

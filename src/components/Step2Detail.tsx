import React from 'react';
import {
  Paintbrush,
  Hammer,
  Sparkles,
  Bath,
  UtensilsCrossed,
  Bed,
  Layers,
  Zap,
  Wrench,
  Grid3X3,
  Building2,
  Home,
} from 'lucide-react';
import {
  EngineeringType,
  PropertyType,
  RepairScope,
  RepairType,
  RoomType,
} from '../types/quiz';
import {
  ENGINEERING_RATES,
  PROPERTY_MULTIPLIERS,
  REPAIR_RATES,
  ROOM_RATES,
  formatUAH,
} from '../utils/calculator';
import { hapticImpact } from '../utils/telegram';

interface Step2DetailProps {
  scope: RepairScope;
  repairType: RepairType;
  roomType: RoomType;
  engineeringType: EngineeringType;
  propertyType: PropertyType;
  onRepairTypeChange: (val: RepairType) => void;
  onRoomTypeChange: (val: RoomType) => void;
  onEngineeringTypeChange: (val: EngineeringType) => void;
  onPropertyTypeChange: (val: PropertyType) => void;
}

export const Step2Detail: React.FC<Step2DetailProps> = ({
  scope,
  repairType,
  roomType,
  engineeringType,
  propertyType,
  onRepairTypeChange,
  onRoomTypeChange,
  onEngineeringTypeChange,
  onPropertyTypeChange,
}) => {
  // Case 1: Whole flat / house
  if (scope === 'whole_flat') {
    const repairKeys: RepairType[] = ['cosmetic', 'capital', 'designer'];
    const propKeys: PropertyType[] = ['new', 'secondary'];

    const repairIcons: Record<RepairType, React.ReactNode> = {
      cosmetic: <Paintbrush className="w-5 h-5" />,
      capital: <Hammer className="w-5 h-5" />,
      designer: <Sparkles className="w-5 h-5" />,
    };

    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Клас ремонту та стан житла
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Тарифи майстрів за 1 м² під ключ у Луцьку
          </p>
        </div>

        {/* Repair Class Selection */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Клас ремонту
          </div>
          {repairKeys.map((key) => {
            const item = REPAIR_RATES[key];
            const isSelected = repairType === key;

            return (
              <div
                key={key}
                onClick={() => {
                  hapticImpact('light');
                  onRepairTypeChange(key);
                }}
                role="button"
                tabIndex={0}
                className={`relative flex items-start gap-3.5 rounded-2xl p-4 cursor-pointer transition-all duration-200 select-none active:scale-[0.985] ${
                  isSelected
                    ? 'border border-amber-500/40 bg-gradient-to-b from-amber-500/[0.12] to-amber-500/[0.02] shadow-[0_0_20px_-3px_rgba(245,158,11,0.2)]'
                    : 'bg-[#13161C]/60 backdrop-blur-lg border border-white/[0.07] hover:border-white/[0.15]'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : 'bg-white/[0.04] text-neutral-400 border-white/[0.06]'
                  }`}
                >
                  {repairIcons[key]}
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-semibold text-sm text-white">
                    {item.title}
                  </h3>
                  <div className="mt-0.5">
                    <span className="text-amber-400 font-bold text-sm tracking-tight">
                      {formatUAH(item.pricePerM2)}/м²
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

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

        {/* Property Type Selection */}
        <div className="space-y-2.5 pt-2">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Тип об'єкта
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {propKeys.map((key) => {
              const item = PROPERTY_MULTIPLIERS[key];
              const isSelected = propertyType === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    hapticImpact('light');
                    onPropertyTypeChange(key);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all active:scale-[0.985] flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/[0.12] to-amber-500/[0.02] shadow-[0_0_16px_rgba(245,158,11,0.15)] text-white'
                      : 'bg-[#13161C]/60 backdrop-blur-lg border-white/[0.07] text-neutral-400 hover:text-white hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.06] text-amber-400">
                      {key === 'new' ? <Building2 className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      x{item.multiplier.toFixed(1)}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-white">
                    {item.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Single Room
  if (scope === 'single_room') {
    const roomKeys: RoomType[] = ['bathroom', 'kitchen', 'bedroom', 'balcony'];
    const roomIcons: Record<RoomType, React.ReactNode> = {
      bathroom: <Bath className="w-5 h-5" />,
      kitchen: <UtensilsCrossed className="w-5 h-5" />,
      bedroom: <Bed className="w-5 h-5" />,
      balcony: <Layers className="w-5 h-5" />,
    };

    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Оберіть приміщення
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Комплексний ремонт конкретної кімнати в Луцьку
          </p>
        </div>

        <div className="space-y-3">
          {roomKeys.map((key) => {
            const item = ROOM_RATES[key];
            const isSelected = roomType === key;

            return (
              <div
                key={key}
                onClick={() => {
                  hapticImpact('light');
                  onRoomTypeChange(key);
                }}
                role="button"
                tabIndex={0}
                className={`relative flex items-start gap-3.5 rounded-2xl p-4 cursor-pointer transition-all duration-200 select-none active:scale-[0.985] ${
                  isSelected
                    ? 'border border-amber-500/40 bg-gradient-to-b from-amber-500/[0.12] to-amber-500/[0.02] shadow-[0_0_20px_-3px_rgba(245,158,11,0.2)]'
                    : 'bg-[#13161C]/60 backdrop-blur-lg border border-white/[0.07] hover:border-white/[0.15]'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : 'bg-white/[0.04] text-neutral-400 border-white/[0.06]'
                  }`}
                >
                  {roomIcons[key]}
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-semibold text-sm text-white">
                    {item.title}
                  </h3>
                  <div className="mt-0.5">
                    <span className="text-amber-400 font-bold text-sm tracking-tight">
                      {formatUAH(item.price)}
                      {item.isPerM2 ? '/м²' : ' під ключ'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

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
  }

  // Case 3: Engineering / Specialized works
  const engKeys: EngineeringType[] = ['electric', 'plumbing', 'tile'];
  const engIcons: Record<EngineeringType, React.ReactNode> = {
    electric: <Zap className="w-5 h-5" />,
    plumbing: <Wrench className="w-5 h-5" />,
    tile: <Grid3X3 className="w-5 h-5" />,
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Спеціалізація монтажу
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Точкові інженерні роботи від профільних майстрів бригади
        </p>
      </div>

      <div className="space-y-3">
        {engKeys.map((key) => {
          const item = ENGINEERING_RATES[key];
          const isSelected = engineeringType === key;

          return (
            <div
              key={key}
              onClick={() => {
                hapticImpact('light');
                onEngineeringTypeChange(key);
              }}
              role="button"
              tabIndex={0}
              className={`relative flex items-start gap-3.5 rounded-2xl p-4 cursor-pointer transition-all duration-200 select-none active:scale-[0.985] ${
                isSelected
                  ? 'border border-amber-500/40 bg-gradient-to-b from-amber-500/[0.12] to-amber-500/[0.02] shadow-[0_0_20px_-3px_rgba(245,158,11,0.2)]'
                  : 'bg-[#13161C]/60 backdrop-blur-lg border border-white/[0.07] hover:border-white/[0.15]'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                    : 'bg-white/[0.04] text-neutral-400 border-white/[0.06]'
                }`}
              >
                {engIcons[key]}
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-semibold text-sm text-white">
                  {item.title}
                </h3>
                <div className="mt-0.5">
                  <span className="text-amber-400 font-bold text-sm tracking-tight">
                    {formatUAH(item.price)}
                    {item.isPerM2 ? '/м²' : ' під ключ'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>

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

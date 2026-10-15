import React from 'react';
import { Maximize2, Minus, Plus, CheckCircle2, Sparkles } from 'lucide-react';
import { EngineeringType, RepairScope, RoomType } from '../types/quiz';
import { ENGINEERING_RATES, ROOM_RATES } from '../utils/calculator';
import { hapticImpact } from '../utils/telegram';

interface Step3Props {
  scope: RepairScope;
  roomType: RoomType;
  engineeringType: EngineeringType;
  value: number;
  onChange: (val: number) => void;
}

export const Step3Area: React.FC<Step3Props> = ({
  scope,
  roomType,
  engineeringType,
  value,
  onChange,
}) => {
  // Check if current choice is calculated by m2 or fixed
  const isPerM2 =
    scope === 'whole_flat' ||
    (scope === 'single_room' && roomType === 'bedroom') ||
    (scope === 'engineering' && engineeringType === 'tile');

  // Limits and presets based on scope
  let min = 30;
  let max = 150;
  let presets = [35, 45, 55, 75, 100];

  if (scope === 'single_room' && roomType === 'bedroom') {
    min = 10;
    max = 40;
    presets = [12, 15, 18, 22, 28];
  } else if (scope === 'engineering' && engineeringType === 'tile') {
    min = 5;
    max = 80;
    presets = [10, 15, 20, 30, 50];
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onChange(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      onChange(min);
      return;
    }
    const num = parseInt(rawVal, 10);
    if (!isNaN(num)) {
      onChange(Math.min(max, Math.max(min, num)));
    }
  };

  const handlePreset = (area: number) => {
    hapticImpact('light');
    onChange(area);
  };

  const handleStepChange = (delta: number) => {
    const newVal = Math.min(max, Math.max(min, value + delta));
    if (newVal !== value) {
      hapticImpact('light');
      onChange(newVal);
    }
  };

  // If fixed package
  if (!isPerM2) {
    const title =
      scope === 'single_room'
        ? ROOM_RATES[roomType]?.title
        : ENGINEERING_RATES[engineeringType]?.title;

    const desc =
      scope === 'single_room'
        ? ROOM_RATES[roomType]?.desc
        : ENGINEERING_RATES[engineeringType]?.desc;

    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Параметри робіт
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Фіксований комплекс робіт майстрами без прихованих доплат
          </p>
        </div>

        <div className="bg-[#13161C]/60 backdrop-blur-xl border border-white/[0.08] p-6 rounded-3xl text-center space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-2">
              Стандартне приміщення під ключ
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed px-2">
              {desc}
            </p>
          </div>

          <div className="pt-2 border-t border-white/[0.06] text-left">
            <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Точні розміри та перелік точок узгоджуються на безкоштовному замірі в Луцьку.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dynamic area slider
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Площа приміщення
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Вкажіть площу для точного розрахунку вартості в Луцьку
        </p>
      </div>

      {/* Main Area Display & Direct Stepper Container */}
      <div className="bg-[#13161C]/60 backdrop-blur-xl border border-white/[0.08] p-6 rounded-3xl text-center space-y-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-center gap-1.5 text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">
          <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Площа робіт</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => handleStepChange(-5)}
            disabled={value <= min}
            className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white hover:bg-white/[0.1] active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all shadow-sm"
            aria-label="Зменшити площу"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex items-baseline justify-center gap-1 min-w-[140px]">
            <input
              type="number"
              min={min}
              max={max}
              value={value}
              onChange={handleInputChange}
              className="w-28 text-center font-light text-5xl text-white bg-transparent focus:outline-none transition-colors tracking-tight"
            />
            <span className="text-xl font-normal text-amber-400/90">м²</span>
          </div>

          <button
            type="button"
            onClick={() => handleStepChange(5)}
            disabled={value >= max}
            className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white hover:bg-white/[0.1] active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all shadow-sm"
            aria-label="Збільшити площу"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Range Slider */}
        <div className="pt-2 px-1">
          <input
            type="range"
            min={min}
            max={max}
            step={1}
            value={value}
            onChange={handleSliderChange}
            className="w-full"
          />
          <div className="flex justify-between items-center text-xs text-neutral-500 font-medium mt-2.5 px-0.5">
            <span>{min} м²</span>
            <span className="text-amber-400 font-semibold">{value} м²</span>
            <span>{max} м²</span>
          </div>
        </div>
      </div>

      {/* Quick Select Presets */}
      <div>
        <div className="text-xs text-neutral-400 mb-2 font-medium">Швидкий вибір:</div>
        <div className="grid grid-cols-5 gap-2">
          {presets.map((preset) => {
            const isSelected = value === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handlePreset(preset)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'bg-white/[0.04] border-white/[0.07] text-neutral-400 hover:text-white hover:border-white/[0.15]'
                }`}
              >
                {preset} м²
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

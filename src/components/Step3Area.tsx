import React from 'react';
import { Maximize2, Minus, Plus } from 'lucide-react';
import { hapticImpact } from '../utils/telegram';

interface Step3Props {
  value: number;
  onChange: (val: number) => void;
}

const PRESET_AREAS = [35, 50, 75, 100, 150];

export const Step3Area: React.FC<Step3Props> = ({ value, onChange }) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onChange(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      onChange(20);
      return;
    }
    const num = parseInt(rawVal, 10);
    if (!isNaN(num)) {
      onChange(Math.min(250, Math.max(20, num)));
    }
  };

  const handlePreset = (area: number) => {
    hapticImpact('light');
    onChange(area);
  };

  const handleStepChange = (delta: number) => {
    const newVal = Math.min(250, Math.max(20, value + delta));
    if (newVal !== value) {
      hapticImpact('light');
      onChange(newVal);
    }
  };

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Площа приміщення
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Вкажіть загальну площу вашої квартири або будинку в м²
        </p>
      </div>

      {/* Main Area Display & Direct Stepper Container */}
      <div className="bg-[#13161C]/60 backdrop-blur-xl border border-white/[0.08] p-6 rounded-3xl text-center space-y-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-center gap-1.5 text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">
          <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Загальна площа</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => handleStepChange(-5)}
            disabled={value <= 20}
            className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white hover:bg-white/[0.1] active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all shadow-sm"
            aria-label="Зменшити площу"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex items-baseline justify-center gap-1 min-w-[140px]">
            <input
              type="number"
              min={20}
              max={250}
              value={value}
              onChange={handleInputChange}
              className="w-28 text-center font-light text-5xl text-white bg-transparent focus:outline-none transition-colors tracking-tight"
            />
            <span className="text-xl font-normal text-amber-400/90">м²</span>
          </div>

          <button
            type="button"
            onClick={() => handleStepChange(5)}
            disabled={value >= 250}
            className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white hover:bg-white/[0.1] active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all shadow-sm"
            aria-label="Збільшити площу"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Range Slider with Apple/OneUI styling */}
        <div className="pt-2 px-1">
          <input
            type="range"
            min={20}
            max={250}
            step={1}
            value={value}
            onChange={handleSliderChange}
            className="w-full"
          />
          <div className="flex justify-between items-center text-xs text-neutral-500 font-medium mt-2.5 px-0.5">
            <span>20 м²</span>
            <span className="text-amber-400 font-semibold">{value} м²</span>
            <span>250 м²</span>
          </div>
        </div>
      </div>

      {/* Quick Select Presets */}
      <div>
        <div className="text-xs text-neutral-400 mb-2 font-medium">Швидкий вибір:</div>
        <div className="grid grid-cols-5 gap-2">
          {PRESET_AREAS.map((preset) => {
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

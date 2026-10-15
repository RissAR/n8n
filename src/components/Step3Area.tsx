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
        <h2 className="text-xl font-bold text-[#F3F4F6] tracking-tight">
          Площа приміщення
        </h2>
        <p className="text-sm text-[#9CA3AF] mt-1">
          Вкажіть загальну площу вашої квартири або будинку в м²
        </p>
      </div>

      {/* Main Area Display & Direct Stepper */}
      <div className="bg-[#1A1F24]/90 border border-[#2D343B] p-5 rounded-xl text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-[#9CA3AF] text-xs uppercase tracking-wider font-semibold">
          <Maximize2 className="w-4 h-4 text-[#F59E0B]" />
          <span>Загальна площа</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => handleStepChange(-5)}
            disabled={value <= 20}
            className="w-10 h-10 rounded-lg bg-[#232A31] border border-[#2D343B] flex items-center justify-center text-[#F3F4F6] hover:bg-[#2D343B] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Зменшити площу"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex items-baseline justify-center gap-1.5 min-w-[130px]">
            <input
              type="number"
              min={20}
              max={250}
              value={value}
              onChange={handleInputChange}
              className="w-24 text-center font-extrabold text-4xl text-[#FBBF24] bg-transparent border-b border-transparent focus:border-[#F59E0B] focus:outline-none transition-colors"
            />
            <span className="text-xl font-bold text-[#9CA3AF]">м²</span>
          </div>

          <button
            type="button"
            onClick={() => handleStepChange(5)}
            disabled={value >= 250}
            className="w-10 h-10 rounded-lg bg-[#232A31] border border-[#2D343B] flex items-center justify-center text-[#F3F4F6] hover:bg-[#2D343B] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Збільшити площу"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Range Slider */}
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
          <div className="flex justify-between items-center text-xs text-[#9CA3AF] font-medium mt-2">
            <span>20 м²</span>
            <span className="text-[#F59E0B] font-semibold">{value} м²</span>
            <span>250 м²</span>
          </div>
        </div>
      </div>

      {/* Quick Select Presets */}
      <div>
        <div className="text-xs text-[#9CA3AF] mb-2 font-medium">Швидкий вибір:</div>
        <div className="grid grid-cols-5 gap-2">
          {PRESET_AREAS.map((preset) => {
            const isSelected = value === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handlePreset(preset)}
                className={`py-2 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#FBBF24] shadow-sm'
                    : 'bg-[#1A1F24] border-[#2D343B] text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-[#3E4750]'
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

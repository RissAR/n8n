import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_TITLES = [
  'Тип ремонту',
  'Стан житла',
  'Площа приміщення',
  'Додаткові опції',
  'Контактні дані',
];

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="w-full mb-5">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-amber-400 font-semibold tracking-wide text-[11px] uppercase">
          Крок {currentStep} з {totalSteps}
        </span>
        <span className="text-neutral-400 font-medium text-xs">
          {STEP_TITLES[currentStep - 1] || ''}
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden border border-white/[0.05]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#D97706] to-[#F59E0B] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step Pill Indicators */}
      <div className="flex justify-between items-center mt-2 px-0.5 gap-1.5">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={stepNum}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-amber-400/90'
                  : isCurrent
                  ? 'bg-amber-400/40 shadow-[0_0_6px_rgba(245,158,11,0.3)]'
                  : 'bg-white/[0.06]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

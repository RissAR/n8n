import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

const STEP_TITLES = [
  'Тип ремонту',
  'Стан житла',
  'Площа',
  'Опції',
  'Контакти',
];

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between text-xs font-semibold mb-2">
        <span className="text-[#F59E0B] uppercase tracking-wider">
          Крок {currentStep} з {totalSteps}
        </span>
        <span className="text-[#9CA3AF]">
          {STEP_TITLES[currentStep - 1] || ''}
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 bg-[#232A31] rounded-full overflow-hidden p-0.5 border border-[#2D343B]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#D97706] to-[#F59E0B] transition-all duration-300 ease-out shadow-[0_0_12px_rgba(245,158,11,0.5)]"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center mt-2.5 px-0.5">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={stepNum}
              className={`h-1.5 flex-1 mx-0.5 rounded-full transition-colors duration-200 ${
                isCompleted
                  ? 'bg-[#F59E0B]'
                  : isCurrent
                  ? 'bg-[#F59E0B]/60'
                  : 'bg-[#2D343B]/60'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

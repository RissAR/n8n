import React from 'react';
import { CheckCircle2, XCircle, Calculator, Check, Phone } from 'lucide-react';
import { QuizState } from '../types/quiz';
import { REPAIR_RATES, PROPERTY_MULTIPLIERS, ADDONS_DATA } from '../utils/calculator';
import { closeTelegramApp, hapticImpact } from '../utils/telegram';

interface Step6Props {
  finalFormatted: string;
  quizState: QuizState;
  onReset: () => void;
}

export const Step6Success: React.FC<Step6Props> = ({ finalFormatted, quizState, onReset }) => {
  const handleClose = () => {
    hapticImpact('medium');
    closeTelegramApp();
  };

  const repairInfo = REPAIR_RATES[quizState.repairType];
  const propertyInfo = PROPERTY_MULTIPLIERS[quizState.propertyType];

  return (
    <div className="space-y-6 pt-2 pb-4 text-center">
      {/* Success Icon Badge */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.2)] mx-auto">
        <CheckCircle2 className="w-8 h-8 text-amber-400" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Кошторис розраховано!
        </h2>
        <p className="text-xs text-neutral-400 mt-1.5 px-4 leading-relaxed">
          Кошторис надіслано вам у чат з ботом. Наш майстер зв'яжеться з вами за номером{' '}
          <span className="text-amber-400 font-semibold">{quizState.phone}</span>.
        </p>
      </div>

      {/* Main Premium Result Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/[0.12] to-amber-500/[0.02] border border-amber-500/30 shadow-[0_0_30px_-5px_rgba(245,158,11,0.25)] space-y-1.5">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
          Орієнтовна вартість ремонту
        </div>
        <div className="text-4xl font-extrabold text-amber-300 tracking-tight py-1">
          {finalFormatted}
        </div>
        <div className="text-xs text-neutral-400">
          Враховано площу {quizState.areaM2} м², матеріали та обрані опції
        </div>
      </div>

      {/* Parameter Details Breakdown */}
      <div className="bg-[#13161C]/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-5 text-left space-y-2.5 text-xs">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
          Деталі розрахунку:
        </div>

        <div className="flex justify-between items-center py-1 border-b border-white/[0.05]">
          <span className="text-neutral-400">Тип ремонту:</span>
          <span className="font-semibold text-white">{repairInfo?.title}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-white/[0.05]">
          <span className="text-neutral-400">Тип об'єкта:</span>
          <span className="font-semibold text-white">{propertyInfo?.title}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-white/[0.05]">
          <span className="text-neutral-400">Площа:</span>
          <span className="font-semibold text-white">{quizState.areaM2} м²</span>
        </div>

        {quizState.addons.length > 0 && (
          <div className="py-1">
            <span className="text-neutral-400 block mb-1">Додаткові опції:</span>
            <ul className="space-y-1 pl-0.5">
              {quizState.addons.map((addon) => (
                <li key={addon} className="flex items-center gap-1.5 text-white">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>{ADDONS_DATA[addon]?.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-white/[0.05] text-neutral-400">
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            Клієнт:
          </span>
          <span className="font-medium text-white">
            {quizState.name || 'Користувач'} ({quizState.phone})
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          onClick={handleClose}
          className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#F59E0B] hover:to-[#D97706] active:scale-[0.98] transition-all shadow-[0_8px_20px_-4px_rgba(217,119,6,0.35)] flex items-center justify-center gap-2 border border-amber-500/30"
        >
          <XCircle className="w-4 h-4" />
          <span>Закрити додаток</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full py-3.5 rounded-2xl font-medium text-xs text-neutral-400 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Calculator className="w-3.5 h-3.5 text-amber-400" />
          <span>Розрахувати ще раз</span>
        </button>
      </div>
    </div>
  );
};

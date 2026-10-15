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
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#D97706]/30 to-[#F59E0B]/20 border border-[#F59E0B]/50 shadow-[0_0_30px_rgba(245,158,11,0.25)] mx-auto animate-bounce-short">
        <CheckCircle2 className="w-9 h-9 text-[#F59E0B]" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#F3F4F6] tracking-tight">
          Кошторис розраховано!
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1.5 px-4 leading-relaxed">
          Кошторис надіслано вам у чат з ботом. Наш майстер зв'яжеться з вами за номером{' '}
          <span className="text-[#FBBF24] font-semibold">{quizState.phone}</span>.
        </p>
      </div>

      {/* Main Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#1E252C] to-[#161B20] border-2 border-[#F59E0B] shadow-[0_10px_30px_rgba(217,119,6,0.15)] space-y-2">
        <div className="text-xs uppercase tracking-wider font-semibold text-[#9CA3AF]">
          Орієнтовна вартість ремонту
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold text-[#FBBF24] tracking-tight py-1">
          {finalFormatted}
        </div>
        <div className="text-[11px] text-[#9CA3AF]">
          Враховано площу {quizState.areaM2} м², матеріали та вибрані опції
        </div>
      </div>

      {/* Parameter Details Breakdown */}
      <div className="bg-[#1A1F24]/80 border border-[#2D343B] rounded-xl p-4 text-left space-y-2.5 text-xs">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1">
          Деталі замовлення:
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#2D343B]/60">
          <span className="text-[#9CA3AF]">Тип ремонту:</span>
          <span className="font-semibold text-[#F3F4F6]">{repairInfo?.title}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#2D343B]/60">
          <span className="text-[#9CA3AF]">Тип об'єкта:</span>
          <span className="font-semibold text-[#F3F4F6]">{propertyInfo?.title}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#2D343B]/60">
          <span className="text-[#9CA3AF]">Площа:</span>
          <span className="font-semibold text-[#F3F4F6]">{quizState.areaM2} м²</span>
        </div>

        {quizState.addons.length > 0 && (
          <div className="py-1">
            <span className="text-[#9CA3AF] block mb-1">Додаткові опції:</span>
            <ul className="space-y-1 pl-1">
              {quizState.addons.map((addon) => (
                <li key={addon} className="flex items-center gap-1.5 text-[#F3F4F6]">
                  <Check className="w-3 h-3 text-[#F59E0B]" />
                  <span>{ADDONS_DATA[addon]?.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-[#2D343B]/60 text-[#9CA3AF]">
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#F59E0B]" />
            Клієнт:
          </span>
          <span className="font-medium text-[#F3F4F6]">
            {quizState.name || 'Користувач'} ({quizState.phone})
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleClose}
          className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#E08316] hover:to-[#C25E12] active:scale-[0.99] transition-all shadow-[0_4px_20px_rgba(217,119,6,0.25)] flex items-center justify-center gap-2 border border-[#F59E0B]/40"
        >
          <XCircle className="w-4 h-4" />
          <span>Закрити</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full py-3 rounded-xl font-medium text-xs text-[#9CA3AF] hover:text-[#F3F4F6] bg-[#1A1F24] border border-[#2D343B] hover:border-[#3E4750] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <Calculator className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Розрахувати ще раз</span>
        </button>
      </div>
    </div>
  );
};

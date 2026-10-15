import React from 'react';
import { CheckCircle2, XCircle, Calculator, Check, Phone, MapPin } from 'lucide-react';
import { QuizState } from '../types/quiz';
import {
  ADDONS_DATA,
  DISTRICTS_DATA,
  ENGINEERING_RATES,
  REPAIR_RATES,
  ROOM_RATES,
} from '../utils/calculator';
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

  let scopeTitle = '';
  let detailTitle = '';

  if (quizState.scope === 'whole_flat') {
    scopeTitle = 'Вся квартира / Будинок';
    detailTitle = REPAIR_RATES[quizState.repairType]?.title || '';
  } else if (quizState.scope === 'single_room') {
    scopeTitle = 'Окреме приміщення';
    detailTitle = ROOM_RATES[quizState.roomType]?.title || '';
  } else {
    scopeTitle = 'Спецмонтаж та інженерія';
    detailTitle = ENGINEERING_RATES[quizState.engineeringType]?.title || '';
  }

  const districtTitle = DISTRICTS_DATA[quizState.contact.district]?.title || 'м. Луцьк';

  return (
    <div className="space-y-6 pt-2 pb-4 text-center">
      {/* Success Icon Badge */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.2)] mx-auto">
        <CheckCircle2 className="w-8 h-8 text-amber-400" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Кошторис зафіксовано!
        </h2>
        <p className="text-xs text-neutral-400 mt-1.5 px-4 leading-relaxed">
          Наш виконроб Олег зателефонує вам на номер{' '}
          <span className="text-amber-400 font-semibold">{quizState.contact.phone}</span>{' '}
          для узгодження часу безкоштовного заміру.
        </p>
      </div>

      {/* Main Premium Result Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/[0.12] to-amber-500/[0.02] border border-amber-500/30 shadow-[0_0_30px_-5px_rgba(245,158,11,0.25)] space-y-1.5">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
          Орієнтовна вартість робіт бригади
        </div>
        <div className="text-4xl font-extrabold text-amber-300 tracking-tight py-1">
          {finalFormatted}
        </div>
        <div className="text-xs text-neutral-400">
          Прямі ціни без посередників • Оплата по факту етапів
        </div>
      </div>

      {/* Parameter Details Breakdown */}
      <div className="bg-[#13161C]/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-5 text-left space-y-2.5 text-xs">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
          Деталі замовлення:
        </div>

        <div className="flex justify-between items-center py-1 border-b border-white/[0.05]">
          <span className="text-neutral-400">Формат робіт:</span>
          <span className="font-semibold text-white">{scopeTitle}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-white/[0.05]">
          <span className="text-neutral-400">Специфікація:</span>
          <span className="font-semibold text-white">{detailTitle}</span>
        </div>

        {quizState.scope === 'whole_flat' && (
          <div className="flex justify-between items-center py-1 border-b border-white/[0.05]">
            <span className="text-neutral-400">Площа:</span>
            <span className="font-semibold text-white">{quizState.areaM2} м²</span>
          </div>
        )}

        <div className="flex justify-between items-center py-1 border-b border-white/[0.05]">
          <span className="flex items-center gap-1 text-neutral-400">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            Район / Локація:
          </span>
          <span className="font-semibold text-white">{districtTitle}</span>
        </div>

        {quizState.addons.length > 0 && (
          <div className="py-1">
            <span className="text-neutral-400 block mb-1">Додаткові послуги:</span>
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
            {quizState.contact.name || 'Користувач'} ({quizState.contact.phone})
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
          <span>Розрахувати інший об'єкт</span>
        </button>
      </div>
    </div>
  );
};

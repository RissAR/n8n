import React from 'react';
import { User, Phone, Calendar, Loader2 } from 'lucide-react';
import { StartDateOption } from '../types/quiz';
import { hapticImpact } from '../utils/telegram';

interface Step5Props {
  name: string;
  phone: string;
  startDate: StartDateOption;
  onNameChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onStartDateChange: (val: StartDateOption) => void;
  onSubmit: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

const START_DATE_OPTIONS: { id: StartDateOption; label: string }[] = [
  { id: 'asap', label: 'Якнайшвидше (протягом 1-2 тижнів)' },
  { id: 'month', label: 'Протягом місяця' },
  { id: 'pricing', label: 'Поки просто прицінююся' },
];

export const formatUkrainianPhone = (input: string): string => {
  const allDigits = input.replace(/\D/g, '');
  let nationalDigits = '';

  if (allDigits.startsWith('380')) {
    nationalDigits = allDigits.slice(3);
  } else if (allDigits.startsWith('80')) {
    nationalDigits = allDigits.slice(2);
  } else if (allDigits.startsWith('0')) {
    nationalDigits = allDigits.slice(1);
  } else {
    nationalDigits = allDigits;
  }

  // Maximum 9 national digits (e.g. 50 123 45 67)
  nationalDigits = nationalDigits.slice(0, 9);

  if (nationalDigits.length === 0) {
    return '+380';
  }
  if (nationalDigits.length <= 2) {
    return `+380 (${nationalDigits}`;
  }
  if (nationalDigits.length <= 5) {
    return `+380 (${nationalDigits.slice(0, 2)}) ${nationalDigits.slice(2)}`;
  }
  if (nationalDigits.length <= 7) {
    return `+380 (${nationalDigits.slice(0, 2)}) ${nationalDigits.slice(2, 5)}-${nationalDigits.slice(5)}`;
  }
  return `+380 (${nationalDigits.slice(0, 2)}) ${nationalDigits.slice(2, 5)}-${nationalDigits.slice(5, 7)}-${nationalDigits.slice(7, 9)}`;
};

export const Step5Contact: React.FC<Step5Props> = ({
  name,
  phone,
  startDate,
  onNameChange,
  onPhoneChange,
  onStartDateChange,
  onSubmit,
  isLoading,
  errorMessage,
}) => {
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatUkrainianPhone(rawVal);
    onPhoneChange(formatted);
  };

  const handleStartDateSelect = (option: StartDateOption) => {
    hapticImpact('light');
    onStartDateChange(option);
  };

  // 9 digits after country code 380
  const nationalDigits = phone.replace(/\D/g, '').replace(/^380/, '');
  const isPhoneValid = nationalDigits.length === 9;

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Контактні дані та терміни
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Куди надіслати детальний кошторис та коли плануєте розпочинати?
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-2xl text-red-200 text-xs leading-relaxed backdrop-blur-md">
          {errorMessage}
        </div>
      )}

      {/* Name Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-amber-400" />
          Ваше ім'я
        </label>
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Введіть ваше ім'я"
            className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 transition-all focus:outline-none"
          />
        </div>
      </div>

      {/* Phone Input with Ukrainian Mask */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          Номер телефону <span className="text-amber-400">*</span>
        </label>
        <div className="relative">
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneInput}
            placeholder="+380 (XX) XXX-XX-XX"
            className={`w-full bg-white/[0.04] border rounded-2xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-all ${
              isPhoneValid
                ? 'border-amber-500/50 ring-2 ring-amber-500/20'
                : 'border-white/[0.1] focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20'
            }`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
          <span>Формат: +380 (XX) XXX-XX-XX</span>
          {nationalDigits.length > 0 && !isPhoneValid && (
            <span className="text-amber-400 font-medium">
              Залишилось цифр: {9 - nationalDigits.length}
            </span>
          )}
          {isPhoneValid && (
            <span className="text-emerald-400 font-medium">✓ Номер заповнено</span>
          )}
        </div>
      </div>

      {/* Start Date Selection */}
      <div className="space-y-2 pt-1">
        <label className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          Коли плануєте розпочати ремонт?
        </label>
        <div className="space-y-2">
          {START_DATE_OPTIONS.map((opt) => {
            const isSelected = startDate === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleStartDateSelect(opt.id)}
                className={`w-full text-left p-3.5 rounded-2xl border text-xs font-medium transition-all active:scale-[0.985] flex items-center justify-between ${
                  isSelected
                    ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/[0.12] to-amber-500/[0.02] text-white shadow-[0_0_16px_rgba(245,158,11,0.15)]'
                    : 'bg-[#13161C]/60 backdrop-blur-lg border-white/[0.07] text-neutral-400 hover:text-white hover:border-white/[0.15]'
                }`}
              >
                <span>{opt.label}</span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-2 border-amber-400 bg-amber-500/10'
                      : 'border-white/20 bg-white/[0.03]'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !isPhoneValid}
          className={`w-full py-4 rounded-2xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 border ${
            !isPhoneValid || isLoading
              ? 'bg-white/[0.04] border-white/[0.06] text-neutral-600 opacity-40 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#F59E0B] hover:to-[#D97706] active:scale-[0.98] border-amber-500/40 shadow-[0_8px_24px_-4px_rgba(217,119,6,0.35)]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
              <span>Розраховуємо кошторис...</span>
            </>
          ) : (
            <span>Розрахувати кошторис</span>
          )}
        </button>
      </div>
    </div>
  );
};

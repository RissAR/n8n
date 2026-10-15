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
        <h2 className="text-xl font-bold text-[#F3F4F6] tracking-tight">
          Контактні дані та терміни
        </h2>
        <p className="text-sm text-[#9CA3AF] mt-1">
          Куди надіслати детальний кошторис та коли плануєте розпочинати?
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* Name Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#9CA3AF] flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-[#F59E0B]" />
          Ваше ім'я
        </label>
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Введіть ваше ім'я"
            className="w-full bg-[#1A1F24] border border-[#2D343B] focus:border-[#F59E0B] focus:outline-none rounded-xl px-4 py-3 text-sm text-[#F3F4F6] placeholder-[#6B7280] transition-colors"
          />
        </div>
      </div>

      {/* Phone Input with Ukrainian Mask */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#9CA3AF] flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-[#F59E0B]" />
          Номер телефону <span className="text-[#F59E0B]">*</span>
        </label>
        <div className="relative">
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneInput}
            placeholder="+380 (XX) XXX-XX-XX"
            className={`w-full bg-[#1A1F24] border rounded-xl px-4 py-3 text-sm text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none transition-colors ${
              isPhoneValid
                ? 'border-[#F59E0B] ring-1 ring-[#F59E0B]/30'
                : 'border-[#2D343B] focus:border-[#F59E0B]'
            }`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#6B7280] px-0.5">
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
        <label className="text-xs font-semibold text-[#9CA3AF] flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
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
                className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all active:scale-[0.99] flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#1A1F24] border-[#F59E0B] text-[#F3F4F6] shadow-sm ring-1 ring-[#F59E0B]/30'
                    : 'bg-[#1A1F24]/60 border-[#2D343B] text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-[#3E4750]'
                }`}
              >
                <span>{opt.label}</span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? 'border-[#F59E0B] bg-[#F59E0B]'
                      : 'border-[#3E4750] bg-transparent'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
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
          className={`w-full py-4 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 border ${
            !isPhoneValid || isLoading
              ? 'bg-[#232A31] border-[#2D343B] text-[#6B7280] opacity-40 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#E08316] hover:to-[#C25E12] active:scale-[0.99] border-[#F59E0B]/40 shadow-[0_4px_20px_rgba(217,119,6,0.3)]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#F59E0B]" />
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

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
  // Format phone number to clean +380XXXXXXXXX
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Remove any character except + and digits
    val = val.replace(/[^\d+]/g, '');

    // Ensure it begins with +380
    if (!val.startsWith('+380')) {
      // If user typed 380 or 0...
      const digits = val.replace(/\D/g, '');
      if (digits.startsWith('380')) {
        val = `+${digits}`;
      } else if (digits.startsWith('0')) {
        val = `+38${digits}`;
      } else if (digits.length > 0) {
        val = `+380${digits}`;
      } else {
        val = '+380';
      }
    }

    // Limit to +380 + 9 digits = 13 characters
    if (val.length > 13) {
      val = val.slice(0, 13);
    }

    onPhoneChange(val);
  };

  const handleStartDateSelect = (option: StartDateOption) => {
    hapticImpact('light');
    onStartDateChange(option);
  };

  const isPhoneValid = phone.startsWith('+380') && phone.replace(/\D/g, '').length === 12;

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

      {/* Phone Input */}
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
            placeholder="+380501234567"
            className={`w-full bg-[#1A1F24] border rounded-xl px-4 py-3 text-sm text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none transition-colors ${
              phone.length >= 13 && !isPhoneValid
                ? 'border-red-500'
                : 'border-[#2D343B] focus:border-[#F59E0B]'
            }`}
          />
        </div>
        <p className="text-[11px] text-[#6B7280]">
          Формат: +380 (XX) XXX-XX-XX
        </p>
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
          className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#E08316] hover:to-[#C25E12] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-[0_4px_20px_rgba(217,119,6,0.3)] flex items-center justify-center gap-2 border border-[#F59E0B]/40"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
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

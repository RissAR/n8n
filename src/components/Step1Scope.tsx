import React from 'react';
import { Building2, DoorOpen, Zap } from 'lucide-react';
import { RepairScope } from '../types/quiz';
import { hapticImpact } from '../utils/telegram';

interface Step1ScopeProps {
  value: RepairScope;
  onChange: (val: RepairScope) => void;
}

interface ScopeOption {
  id: RepairScope;
  title: string;
  badge: string;
  desc: string;
  icon: React.ReactNode;
}

const SCOPE_OPTIONS: ScopeOption[] = [
  {
    id: 'whole_flat',
    title: 'Вся квартира / Будинок',
    badge: 'Комплексно під ключ',
    desc: 'Повний цикл робіт від чорнового стану чи вторинки до заселення',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: 'single_room',
    title: 'Окреме приміщення',
    badge: 'Ванна, Кухня, Кімната',
    desc: 'Локальний ремонт окремої зони без переїзду з квартири',
    icon: <DoorOpen className="w-5 h-5" />,
  },
  {
    id: 'engineering',
    title: 'Спецмонтаж та Інженерія',
    badge: 'Електрика, Сантехніка, Плитка',
    desc: 'Профільні майстри для точкових складних монтажних робіт',
    icon: <Zap className="w-5 h-5" />,
  },
];

export const Step1Scope: React.FC<Step1ScopeProps> = ({ value, onChange }) => {
  const handleSelect = (scope: RepairScope) => {
    hapticImpact('light');
    onChange(scope);
  };

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Формат ремонту
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Оберіть обсяг робіт для бригади у м. Луцьк та передмісті
        </p>
      </div>

      <div className="space-y-3">
        {SCOPE_OPTIONS.map((item) => {
          const isSelected = value === item.id;

          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(item.id)}
              className={`relative flex items-start gap-3.5 rounded-2xl p-4 cursor-pointer transition-all duration-200 select-none active:scale-[0.985] ${
                isSelected
                  ? 'border border-amber-500/40 bg-gradient-to-b from-amber-500/[0.12] to-amber-500/[0.02] shadow-[0_0_20px_-3px_rgba(245,158,11,0.2)]'
                  : 'bg-[#13161C]/60 backdrop-blur-lg border border-white/[0.07] hover:border-white/[0.15]'
              }`}
            >
              {/* Icon Container */}
              <div
                className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                    : 'bg-white/[0.04] text-neutral-400 border-white/[0.06]'
                }`}
              >
                {item.icon}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm text-white">
                    {item.title}
                  </h3>
                </div>
                <div className="mt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* iOS Liquid Radio Indicator */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                  isSelected
                    ? 'border-2 border-amber-400 bg-amber-500/10'
                    : 'border border-white/20 bg-white/[0.03]'
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

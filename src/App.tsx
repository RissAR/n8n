import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Wrench, ShieldCheck, Crown, Calculator } from 'lucide-react';
import { ProgressBar } from './components/ProgressBar';
import { Step1RepairType } from './components/Step1RepairType';
import { Step2PropertyType } from './components/Step2PropertyType';
import { Step3Area } from './components/Step3Area';
import { Step4Addons } from './components/Step4Addons';
import { Step5Contact } from './components/Step5Contact';
import { Step6Success } from './components/Step6Success';
import { AdminDashboard } from './components/AdminDashboard';
import {
  AddonKey,
  PropertyType,
  QuizState,
  RepairType,
  StartDateOption,
  WebhookPayload,
  WebhookResponse,
} from './types/quiz';
import { TelegramUser } from './types/telegram';
import { calculateEstimate } from './utils/calculator';
import { checkIsAdmin, ADMIN_USER_ID } from './utils/auth';
import {
  getTelegramUser,
  hapticImpact,
  hapticNotification,
  initTelegramApp,
  showBackButton,
  hideBackButton,
} from './utils/telegram';

export const App: React.FC = () => {
  // 1. State hooks declared unconditionally at the very top
  const [activeTab, setActiveTab] = useState<'quiz' | 'admin'>('quiz');
  const [tgUser, setTgUser] = useState<TelegramUser | undefined>(undefined);
  const [step, setStep] = useState<number>(1);
  const [repairType, setRepairType] = useState<RepairType>('cosmetic');
  const [propertyType, setPropertyType] = useState<PropertyType>('new');
  const [areaM2, setAreaM2] = useState<number>(50);
  const [addons, setAddons] = useState<AddonKey[]>([]);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('+380');
  const [startDate, setStartDate] = useState<StartDateOption>('asap');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [finalFormatted, setFinalFormatted] = useState<string>('');

  // 2. Computed values
  const isAdmin = useMemo(() => {
    return checkIsAdmin(tgUser);
  }, [tgUser]);

  const effectiveUserId = useMemo(() => {
    return tgUser?.id || ADMIN_USER_ID;
  }, [tgUser]);

  const estimate = useMemo(() => {
    return calculateEstimate(repairType, propertyType, areaM2, addons);
  }, [repairType, propertyType, areaM2, addons]);

  const quizState: QuizState = useMemo(() => {
    return {
      repairType,
      propertyType,
      areaM2,
      addons,
      name,
      phone,
      startDate,
    };
  }, [repairType, propertyType, areaM2, addons, name, phone, startDate]);

  // 3. Navigation handlers
  const handlePrevStep = useCallback(() => {
    if (step > 1 && step < 6) {
      hapticImpact('light');
      setStep((prev) => prev - 1);
      setErrorMessage(null);
    }
  }, [step]);

  const handleNextStep = useCallback(() => {
    if (step < 5) {
      hapticImpact('light');
      setStep((prev) => prev + 1);
      setErrorMessage(null);
    }
  }, [step]);

  const handleReset = useCallback(() => {
    hapticImpact('light');
    setStep(1);
    setRepairType('cosmetic');
    setPropertyType('new');
    setAreaM2(50);
    setAddons([]);
    setErrorMessage(null);
    setFinalFormatted('');
  }, []);

  const handleTabChange = useCallback((tab: 'quiz' | 'admin') => {
    hapticImpact('light');
    setActiveTab(tab);
  }, []);

  // 4. Initialize Telegram WebApp on mount
  useEffect(() => {
    initTelegramApp();
    const user = getTelegramUser();
    if (user) {
      setTgUser(user);
      if (user.first_name) {
        setName(user.first_name);
      }
    }
  }, []);

  // 5. Telegram BackButton handler sync
  useEffect(() => {
    if (activeTab === 'quiz' && step > 1 && step <= 5) {
      showBackButton(handlePrevStep);
      return () => {
        hideBackButton();
      };
    } else {
      hideBackButton();
    }
  }, [activeTab, step, handlePrevStep]);

  // 6. Submit calculation payload to n8n Webhook
  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const webhookUrl =
      import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://quizleads.app.n8n.cloud/webhook/quiz-calculator';

    const payload: WebhookPayload = {
      user: {
        id: tgUser?.id || 8607080614,
        username: tgUser?.username || '',
        first_name: name || tgUser?.first_name || 'Гість',
      },
      quiz: {
        repair_type: repairType,
        property_type: propertyType,
        area_m2: areaM2,
        addons: addons,
        start_date: startDate,
      },
      contact: {
        name: name || 'Гість',
        phone: phone,
      },
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Помилка сервера n8n: HTTP ${response.status}`);
      }

      const data: WebhookResponse = await response.json();
      const resultFormatted = data.totalFormatted || estimate.totalFormatted;

      setFinalFormatted(resultFormatted);
      hapticNotification('success');
      setStep(6);
    } catch (err) {
      console.warn('Webhook request failed, falling back to local calculation:', err);
      // Fallback: If n8n is offline or unreachable in dev mode, still show calculation
      setFinalFormatted(estimate.totalFormatted);
      hapticNotification('warning');
      setStep(6);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-[#F3F4F6] flex flex-col justify-between max-w-md mx-auto relative px-4 py-4 pb-8 sm:py-6">
      {/* Top Header */}
      <header className="mb-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">
                Калькулятор ремонту
              </h1>
              <p className="text-[11px] text-neutral-400">
                Розрахунок за 1 хвилину
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-neutral-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Точний прайс</span>
          </div>
        </div>

        {/* iOS Segmented Control for Admin */}
        {isAdmin && (
          <div className="mt-3.5 p-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl flex items-center gap-1 shadow-sm backdrop-blur-md">
            <button
              type="button"
              onClick={() => handleTabChange('quiz')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                activeTab === 'quiz'
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Калькулятор</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Заявки CRM</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col justify-start">
        {isAdmin && activeTab === 'admin' ? (
          <AdminDashboard currentUserId={effectiveUserId} />
        ) : (
          <>
            {step < 6 && (
              <ProgressBar currentStep={step} totalSteps={5} />
            )}

            {step === 1 && (
              <Step1RepairType
                value={repairType}
                onChange={(val) => setRepairType(val)}
              />
            )}

            {step === 2 && (
              <Step2PropertyType
                value={propertyType}
                onChange={(val) => setPropertyType(val)}
              />
            )}

            {step === 3 && (
              <Step3Area
                value={areaM2}
                onChange={(val) => setAreaM2(val)}
              />
            )}

            {step === 4 && (
              <Step4Addons
                value={addons}
                onChange={(val) => setAddons(val)}
              />
            )}

            {step === 5 && (
              <Step5Contact
                name={name}
                phone={phone}
                startDate={startDate}
                onNameChange={setName}
                onPhoneChange={setPhone}
                onStartDateChange={setStartDate}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                errorMessage={errorMessage}
              />
            )}

            {step === 6 && (
              <Step6Success
                finalFormatted={finalFormatted}
                quizState={quizState}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Frosted Glass Bottom Bar for Steps 1 - 4 (Only in Quiz view) */}
      {(!isAdmin || activeTab === 'quiz') && step < 5 && (
        <footer className="sticky bottom-0 pt-3 pb-2 bg-[#0B0D11]/80 backdrop-blur-2xl border-t border-white/[0.08] mt-6 z-10">
          <div className="flex items-center justify-between gap-3">
            {/* Previous Step Button */}
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-neutral-300 hover:text-white hover:border-white/[0.15] active:scale-95 transition-all flex items-center justify-center shadow-sm"
                aria-label="Попередній крок"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="text-[11px] text-neutral-400 pl-1">
                Попередньо: <span className="text-amber-400 font-bold">{estimate.totalFormatted}</span>
              </div>
            )}

            {/* Next Step Button */}
            <button
              type="button"
              onClick={handleNextStep}
              className="flex-1 h-12 px-5 rounded-2xl font-medium text-sm text-white bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#F59E0B] hover:to-[#D97706] active:scale-[0.98] transition-all shadow-[0_8px_20px_-4px_rgba(217,119,6,0.35)] flex items-center justify-center gap-2 border border-amber-500/30"
            >
              <span>Далі</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Wrench, ShieldCheck } from 'lucide-react';
import { ProgressBar } from './components/ProgressBar';
import { Step1RepairType } from './components/Step1RepairType';
import { Step2PropertyType } from './components/Step2PropertyType';
import { Step3Area } from './components/Step3Area';
import { Step4Addons } from './components/Step4Addons';
import { Step5Contact } from './components/Step5Contact';
import { Step6Success } from './components/Step6Success';
import {
  AddonKey,
  PropertyType,
  QuizState,
  RepairType,
  StartDateOption,
  WebhookPayload,
  WebhookResponse,
} from './types/quiz';
import { calculateEstimate } from './utils/calculator';
import {
  getTelegramUser,
  getTelegramWebApp,
  hapticImpact,
  hapticNotification,
  initTelegram,
} from './utils/telegram';

export const App: React.FC = () => {
  // 1. State hooks declared unconditionally at the very top
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

  // 4. Initialize Telegram WebApp on mount
  useEffect(() => {
    initTelegram();
    const tgUser = getTelegramUser();
    if (tgUser?.first_name) {
      setName(tgUser.first_name);
    }
  }, []);

  // 5. Telegram BackButton handler sync
  useEffect(() => {
    const tg = getTelegramWebApp();
    if (!tg?.BackButton) return;

    if (step > 1 && step < 6) {
      tg.BackButton.show();
      const onBack = () => {
        handlePrevStep();
      };
      tg.BackButton.onClick(onBack);
      return () => {
        tg.BackButton.offClick(onBack);
      };
    } else {
      tg.BackButton.hide();
    }
  }, [step, handlePrevStep]);

  // 6. Submit calculation payload to n8n Webhook
  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const tgUser = getTelegramUser();
    const webhookUrl =
      import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test/quiz-calculator';

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
      // and notify user that result is calculated locally.
      setFinalFormatted(estimate.totalFormatted);
      hapticNotification('warning');
      setStep(6);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121518] text-[#F3F4F6] flex flex-col justify-between max-w-md mx-auto relative px-4 py-4 pb-8 sm:py-6">
      {/* Top Header */}
      <header className="mb-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2D343B]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#D97706] to-[#F59E0B] flex items-center justify-center text-white shadow-sm">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[#F3F4F6]">
                Калькулятор ремонту
              </h1>
              <p className="text-[11px] text-[#9CA3AF]">
                Розрахунок за 1 хвилину
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#9CA3AF] bg-[#1A1F24] border border-[#2D343B] px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Точний прайс</span>
          </div>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="flex-1 flex flex-col justify-start">
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
      </main>

      {/* Bottom Sticky / Bar for Steps 1 - 4 */}
      {step < 5 && (
        <footer className="sticky bottom-0 pt-4 pb-2 bg-[#121518]/95 backdrop-blur-md border-t border-[#2D343B]/80 mt-6 z-10">
          <div className="flex items-center justify-between gap-3">
            {/* Previous Step Button */}
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="p-3.5 rounded-xl bg-[#1A1F24] border border-[#2D343B] text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-[#3E4750] active:scale-95 transition-all flex items-center justify-center"
                aria-label="Попередній крок"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="text-[11px] text-[#9CA3AF]">
                Попередньо: <span className="text-[#FBBF24] font-bold">{estimate.totalFormatted}</span>
              </div>
            )}

            {/* Next Step Button */}
            <button
              type="button"
              onClick={handleNextStep}
              className="flex-1 py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#E08316] hover:to-[#C25E12] active:scale-[0.99] transition-all shadow-[0_4px_16px_rgba(217,119,6,0.25)] flex items-center justify-center gap-2 border border-[#F59E0B]/30"
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

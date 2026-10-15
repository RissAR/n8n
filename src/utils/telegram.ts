import { TelegramUser, TelegramWebApp } from '../types/telegram';

export const getTelegramWebApp = (): TelegramWebApp | undefined => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return undefined;
};

export const initTelegramApp = (): void => {
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready?.();
      tg.expand?.();
      tg.setHeaderColor?.('#121518');
      tg.setBackgroundColor?.('#121518');
      tg.enableClosingConfirmation?.();
    } catch (e) {
      console.warn('Telegram WebApp init warning:', e);
    }
  }
};

export const initTelegram = initTelegramApp;

let currentBackCallback: (() => void) | null = null;

export const showBackButton = (onBack: () => void): void => {
  const tg = getTelegramWebApp();
  if (!tg?.BackButton) return;

  try {
    if (currentBackCallback) {
      tg.BackButton.offClick?.(currentBackCallback);
    }
    currentBackCallback = onBack;
    tg.BackButton.onClick?.(onBack);
    tg.BackButton.show?.();
  } catch (e) {
    console.warn('Error showing Telegram BackButton:', e);
  }
};

export const hideBackButton = (): void => {
  const tg = getTelegramWebApp();
  if (!tg?.BackButton) return;

  try {
    if (currentBackCallback) {
      tg.BackButton.offClick?.(currentBackCallback);
      currentBackCallback = null;
    }
    tg.BackButton.hide?.();
  } catch (e) {
    console.warn('Error hiding Telegram BackButton:', e);
  }
};

export const setHeaderColor = (color: string): void => {
  const tg = getTelegramWebApp();
  try {
    tg?.setHeaderColor?.(color);
  } catch (e) {
    // Ignore in unsupported environments
  }
};

export const setBackgroundColor = (color: string): void => {
  const tg = getTelegramWebApp();
  try {
    tg?.setBackgroundColor?.(color);
  } catch (e) {
    // Ignore in unsupported environments
  }
};

export const hapticImpact = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light'): void => {
  const tg = getTelegramWebApp();
  try {
    tg?.HapticFeedback?.impactOccurred?.(style);
  } catch (e) {
    // Ignore in unsupported environments
  }
};

export const hapticNotification = (type: 'error' | 'success' | 'warning'): void => {
  const tg = getTelegramWebApp();
  try {
    tg?.HapticFeedback?.notificationOccurred?.(type);
  } catch (e) {
    // Ignore in unsupported environments
  }
};

export const getTelegramUser = (): TelegramUser | undefined => {
  const tg = getTelegramWebApp();
  return tg?.initDataUnsafe?.user;
};

export const closeTelegramApp = (): void => {
  const tg = getTelegramWebApp();
  try {
    tg?.close?.();
  } catch (e) {
    console.warn('Could not close Telegram WebApp:', e);
  }
};

import { TelegramUser, TelegramWebApp } from '../types/telegram';

export const getTelegramWebApp = (): TelegramWebApp | undefined => {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp;
  }
  return undefined;
};

export const initTelegram = (): void => {
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
    } catch (e) {
      console.warn('Telegram WebApp init error:', e);
    }
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
  if (tg) {
    try {
      tg.close();
    } catch (e) {
      console.warn('Could not close Telegram WebApp:', e);
    }
  }
};

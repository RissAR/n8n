import { TelegramUser, TelegramWebApp } from '../types/telegram';

export const getTelegramWebApp = (): TelegramWebApp | undefined => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return undefined;
};

export const initTelegram = (): void => {
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready?.();
      tg.expand?.();
      tg.setHeaderColor?.('#121518');
      tg.setBackgroundColor?.('#121518');
    } catch (e) {
      console.warn('Telegram WebApp init warning:', e);
    }
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

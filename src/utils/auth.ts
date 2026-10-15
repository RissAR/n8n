import { TelegramUser } from '../types/telegram';

export const ADMIN_USER_ID = import.meta.env.VITE_ADMIN_USER_ID || '8607080614';

export const isDevAdminUrlParam = (): boolean => {
  if (typeof window !== 'undefined' && window.location && window.location.search) {
    const params = new URLSearchParams(window.location.search);
    return params.get('admin') === 'true' || window.location.search.includes('admin=true');
  }
  return false;
};

export const checkIsAdmin = (user?: TelegramUser | { id?: number | string } | null): boolean => {
  // 1. URL parameter override for local development and testing
  if (isDevAdminUrlParam()) {
    return true;
  }

  // 2. Telegram user ID match check
  if (user && user.id !== undefined && user.id !== null) {
    return String(user.id) === String(ADMIN_USER_ID);
  }

  return false;
};

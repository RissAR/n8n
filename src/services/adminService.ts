import { Lead, AdminLeadsResponse } from '../types/admin';

export const fetchAdminLeads = async (userId: string | number): Promise<Lead[]> => {
  const url =
    import.meta.env.VITE_N8N_ADMIN_LEADS_URL || 'https://quizleads.app.n8n.cloud/webhook/admin-leads';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: String(userId) }),
  });

  if (response.status === 403) {
    throw new Error('403 Forbidden: Доступ заборонено. Тільки адміністратор має доступ до заявок.');
  }

  if (!response.ok) {
    throw new Error(`Помилка отримання даних від n8n: HTTP ${response.status}`);
  }

  const data: AdminLeadsResponse | Lead[] = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.leads)) {
    return data.leads;
  }

  return [];
};

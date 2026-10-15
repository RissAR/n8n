import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  RotateCw,
  Phone,
  Calendar,
  Layers,
  Home,
  Check,
  AlertCircle,
  Inbox,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Lead } from '../types/admin';
import { fetchAdminLeads } from '../services/adminService';
import { hapticImpact, hapticNotification } from '../utils/telegram';

interface AdminDashboardProps {
  currentUserId: string | number;
}

type FilterStatus = 'all' | 'новий лід' | 'в роботі' | 'замір' | 'угода';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUserId }) => {
  // 1. Hooks unconditionally declared at top
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  // 2. Fetch leads logic
  const loadLeads = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setIsRefreshing(true);
        hapticImpact('light');
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const data = await fetchAdminLeads(currentUserId);
        setLeads(data);
        if (isManualRefresh) {
          hapticNotification('success');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Не вдалося завантажити ліди';
        setError(msg);
        if (isManualRefresh) {
          hapticNotification('error');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [currentUserId]
  );

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // 3. Analytics calculation
  const analytics = useMemo(() => {
    const totalCount = leads.length;
    const newCount = leads.filter((l) =>
      (l.status || '').toLowerCase().includes('новий')
    ).length;

    const totalSum = leads.reduce((acc, lead) => {
      if (!lead.total) return acc;
      // Extract numeric value from strings like "439 250 грн" or 439250
      const digits = String(lead.total).replace(/[^\d]/g, '');
      const val = parseInt(digits, 10);
      return !isNaN(val) ? acc + val : acc;
    }, 0);

    return {
      totalCount,
      newCount,
      totalSumFormatted: `${totalSum.toLocaleString('uk-UA')} грн`,
    };
  }, [leads]);

  // 4. Filtering logic
  const filteredLeads = useMemo(() => {
    if (activeFilter === 'all') return leads;

    return leads.filter((l) => {
      const st = (l.status || '').toLowerCase();
      return st.includes(activeFilter);
    });
  }, [leads, activeFilter]);

  const handleFilterClick = (status: FilterStatus) => {
    hapticImpact('light');
    setActiveFilter(status);
  };

  // Helper for status badge colors
  const getStatusBadge = (statusStr: string) => {
    const s = (statusStr || '').toLowerCase();
    if (s.includes('новий')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-[#FBBF24] border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse" />
          {statusStr || 'Новий лід'}
        </span>
      );
    }
    if (s.includes('робот')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          {statusStr}
        </span>
      );
    }
    if (s.includes('замір')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          {statusStr}
        </span>
      );
    }
    if (s.includes('угод')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {statusStr}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#232A31] text-[#9CA3AF] border border-[#2D343B]">
        {statusStr || 'В обробці'}
      </span>
    );
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#F3F4F6] tracking-tight flex items-center gap-2">
            <span>Панель заявок</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#D97706] to-[#B45309] text-white">
              CRM
            </span>
          </h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Синхронізація з Google Sheets у реальному часі
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadLeads(true)}
          disabled={isLoading || isRefreshing}
          className="p-2.5 rounded-xl bg-[#1A1F24] border border-[#2D343B] text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-[#F59E0B]/50 active:scale-95 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center"
          title="Оновити заявки"
        >
          <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#F59E0B]' : ''}`} />
        </button>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#1A1F24]/90 border border-[#2D343B] p-3 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-[#9CA3AF] flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-[#F59E0B]" />
            Всього
          </div>
          <div className="text-lg font-black text-[#F3F4F6]">
            {isLoading ? '...' : analytics.totalCount}
          </div>
        </div>

        <div className="bg-[#1A1F24]/90 border border-[#2D343B] p-3 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-[#FBBF24]" />
            Нових
          </div>
          <div className="text-lg font-black text-[#FBBF24]">
            {isLoading ? '...' : analytics.newCount}
          </div>
        </div>

        <div className="bg-[#1A1F24]/90 border border-[#2D343B] p-3 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-[#9CA3AF] flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            Кошторис
          </div>
          <div className="text-xs font-black text-emerald-400 truncate mt-1">
            {isLoading ? '...' : analytics.totalSumFormatted}
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        <button
          type="button"
          onClick={() => handleFilterClick('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeFilter === 'all'
              ? 'bg-[#F59E0B] text-[#121518] shadow-sm'
              : 'bg-[#1A1F24] border border-[#2D343B] text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
        >
          Всі ({leads.length})
        </button>

        <button
          type="button"
          onClick={() => handleFilterClick('новий лід')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeFilter === 'новий лід'
              ? 'bg-amber-500 text-[#121518] shadow-sm'
              : 'bg-[#1A1F24] border border-[#2D343B] text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
        >
          🟡 Нові ({leads.filter((l) => (l.status || '').toLowerCase().includes('новий')).length})
        </button>

        <button
          type="button"
          onClick={() => handleFilterClick('в роботі')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeFilter === 'в роботі'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-[#1A1F24] border border-[#2D343B] text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
        >
          📞 В роботі ({leads.filter((l) => (l.status || '').toLowerCase().includes('робот')).length})
        </button>

        <button
          type="button"
          onClick={() => handleFilterClick('замір')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeFilter === 'замір'
              ? 'bg-purple-500 text-white shadow-sm'
              : 'bg-[#1A1F24] border border-[#2D343B] text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
        >
          📐 Замір ({leads.filter((l) => (l.status || '').toLowerCase().includes('замір')).length})
        </button>

        <button
          type="button"
          onClick={() => handleFilterClick('угода')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeFilter === 'угода'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'bg-[#1A1F24] border border-[#2D343B] text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
        >
          🤝 Угода ({leads.filter((l) => (l.status || '').toLowerCase().includes('угод')).length})
        </button>
      </div>

      {/* Content Area */}
      {isLoading ? (
        // Loading Skeleton
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#1A1F24] border border-[#2D343B] p-4 rounded-xl animate-pulse space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-28 bg-[#232A31] rounded" />
                <div className="h-5 w-20 bg-[#232A31] rounded-full" />
              </div>
              <div className="h-5 w-40 bg-[#232A31] rounded" />
              <div className="h-4 w-52 bg-[#232A31] rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        // Error State
        <div className="p-5 bg-red-950/40 border border-red-800/80 rounded-xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <div>
            <div className="text-sm font-bold text-red-200">Помилка завантаження лідів</div>
            <p className="text-xs text-red-300/80 mt-1">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => loadLeads(false)}
            className="px-4 py-2 bg-red-900/60 hover:bg-red-800 border border-red-700 text-xs font-semibold text-white rounded-lg transition-colors"
          >
            Спробувати знову
          </button>
        </div>
      ) : filteredLeads.length === 0 ? (
        // Empty State
        <div className="p-8 bg-[#1A1F24]/50 border border-[#2D343B] rounded-xl text-center space-y-3 my-4">
          <Inbox className="w-10 h-10 text-[#6B7280] mx-auto stroke-1" />
          <div>
            <div className="text-sm font-semibold text-[#F3F4F6]">Заявок поки немає</div>
            <p className="text-xs text-[#9CA3AF] mt-1">
              {activeFilter === 'all'
                ? 'Нові розрахунки ремонту від користувачів з’являться тут.'
                : 'Немає заявок з вибраним фільтром статусу.'}
            </p>
          </div>
        </div>
      ) : (
        // Leads List
        <div className="space-y-3">
          {filteredLeads.map((lead) => {
            const cleanPhone = (lead.phone || '').replace(/[^\d+]/g, '');

            return (
              <div
                key={lead.id || `${lead.userId}-${lead.timestamp}`}
                className="bg-[#1A1F24] border border-[#2D343B] hover:border-[#3E4750] p-4 rounded-xl transition-all shadow-sm space-y-3"
              >
                {/* Header: Timestamp & Status */}
                <div className="flex items-center justify-between text-[11px] text-[#9CA3AF]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#F59E0B]" />
                    {lead.timestamp || 'Щойно'}
                  </span>
                  <div>{getStatusBadge(lead.status)}</div>
                </div>

                {/* Client Name & Username */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#F3F4F6] tracking-tight">
                      {lead.name || 'Клієнт без імені'}
                    </h3>
                    {lead.username && (
                      <div className="text-xs text-[#9CA3AF] mt-0.5">
                        {lead.username.startsWith('@') ? (
                          <a
                            href={`https://t.me/${lead.username.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F59E0B] hover:underline"
                          >
                            {lead.username}
                          </a>
                        ) : (
                          lead.username
                        )}
                      </div>
                    )}
                  </div>

                  {/* Calculated Price */}
                  <div className="text-right">
                    <div className="text-[10px] text-[#9CA3AF] uppercase font-semibold">
                      Кошторис
                    </div>
                    <div className="text-base font-extrabold text-[#FBBF24]">
                      {lead.total || '0 грн'}
                    </div>
                  </div>
                </div>

                {/* Object Parameters */}
                <div className="bg-[#121518]/60 p-2.5 rounded-lg border border-[#2D343B]/60 space-y-1.5 text-xs text-[#9CA3AF]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#F59E0B]" />
                      Тип ремонту:
                    </span>
                    <span className="font-semibold text-[#F3F4F6]">
                      {lead.repairType || '—'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-[#F59E0B]" />
                      Об'єкт:
                    </span>
                    <span className="font-semibold text-[#F3F4F6]">
                      {lead.propertyType || '—'} ({lead.areaM2 ? `${lead.areaM2} м²` : '—'})
                    </span>
                  </div>

                  {lead.addons && lead.addons !== 'Без додаткових опцій' && (
                    <div className="pt-1 border-t border-[#2D343B]/40">
                      <div className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                        <span className="text-[11px] text-[#D1D5DB] leading-tight">
                          {lead.addons}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone Call Button */}
                <div className="pt-1">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#232A31] hover:bg-[#2D343B] active:scale-[0.99] border border-[#2D343B] text-xs font-semibold text-[#F3F4F6] flex items-center justify-center gap-2 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Зателефонувати: {lead.phone || 'Не вказано'}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

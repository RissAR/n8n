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

  // Helper for status badge colors (Apple HIG style)
  const getStatusBadge = (statusStr: string) => {
    const s = (statusStr || '').toLowerCase();
    if (s.includes('новий')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          {statusStr || 'Новий лід'}
        </span>
      );
    }
    if (s.includes('робот')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          {statusStr}
        </span>
      );
    }
    if (s.includes('замір')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          {statusStr}
        </span>
      );
    }
    if (s.includes('угод')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {statusStr}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/[0.04] text-neutral-400 border border-white/[0.08]">
        {statusStr || 'В обробці'}
      </span>
    );
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Панель заявок</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              CRM
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Синхронізація з Google Sheets у реальному часі
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadLeads(true)}
          disabled={isLoading || isRefreshing}
          className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-neutral-300 hover:text-white hover:border-white/[0.15] active:scale-95 disabled:opacity-40 transition-all shadow-sm flex items-center justify-center"
          title="Оновити заявки"
        >
          <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      {/* Analytics KPI Cards (Apple Health / Notes Style) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#13161C]/60 backdrop-blur-xl border border-white/[0.08] p-3.5 rounded-2xl">
          <div className="text-[10px] uppercase font-semibold text-neutral-400 flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-neutral-400" />
            Всього
          </div>
          <div className="text-2xl font-light text-white tracking-tight">
            {isLoading ? '...' : analytics.totalCount}
          </div>
        </div>

        <div className="bg-[#13161C]/60 backdrop-blur-xl border border-white/[0.08] p-3.5 rounded-2xl">
          <div className="text-[10px] uppercase font-semibold text-amber-400/90 flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Нових
          </div>
          <div className="text-2xl font-light text-amber-300 tracking-tight">
            {isLoading ? '...' : analytics.newCount}
          </div>
        </div>

        <div className="bg-[#13161C]/60 backdrop-blur-xl border border-white/[0.08] p-3.5 rounded-2xl">
          <div className="text-[10px] uppercase font-semibold text-neutral-400 flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            Кошторис
          </div>
          <div className="text-xs font-semibold text-emerald-400 truncate mt-2">
            {isLoading ? '...' : analytics.totalSumFormatted}
          </div>
        </div>
      </div>

      {/* Horizontal Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        <button
          type="button"
          onClick={() => handleFilterClick('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 ${
            activeFilter === 'all'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'bg-white/[0.04] border border-white/[0.08] text-neutral-400 hover:text-white'
          }`}
        >
          Всі ({leads.length})
        </button>

        <button
          type="button"
          onClick={() => handleFilterClick('новий лід')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 ${
            activeFilter === 'новий лід'
              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-sm'
              : 'bg-white/[0.04] border border-white/[0.08] text-neutral-400 hover:text-white'
          }`}
        >
          🟡 Нові ({leads.filter((l) => (l.status || '').toLowerCase().includes('новий')).length})
        </button>

        <button
          type="button"
          onClick={() => handleFilterClick('в роботі')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 ${
            activeFilter === 'в роботі'
              ? 'bg-blue-500/25 text-blue-300 border border-blue-500/50 shadow-sm'
              : 'bg-white/[0.04] border border-white/[0.08] text-neutral-400 hover:text-white'
          }`}
        >
          📞 В роботі ({leads.filter((l) => (l.status || '').toLowerCase().includes('робот')).length})
        </button>

        <button
          type="button"
          onClick={() => handleFilterClick('замір')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 ${
            activeFilter === 'замір'
              ? 'bg-purple-500/25 text-purple-300 border border-purple-500/50 shadow-sm'
              : 'bg-white/[0.04] border border-white/[0.08] text-neutral-400 hover:text-white'
          }`}
        >
          📐 Замір ({leads.filter((l) => (l.status || '').toLowerCase().includes('замір')).length})
        </button>

        <button
          type="button"
          onClick={() => handleFilterClick('угода')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 ${
            activeFilter === 'угода'
              ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-sm'
              : 'bg-white/[0.04] border border-white/[0.08] text-neutral-400 hover:text-white'
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
              className="bg-[#13161C]/60 backdrop-blur-xl border border-white/[0.08] p-4 rounded-3xl animate-pulse space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-white/[0.06] rounded-full" />
                <div className="h-5 w-20 bg-white/[0.06] rounded-full" />
              </div>
              <div className="h-5 w-36 bg-white/[0.06] rounded-xl" />
              <div className="h-4 w-48 bg-white/[0.06] rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        // Error State
        <div className="p-5 bg-red-950/30 border border-red-500/20 rounded-3xl text-center space-y-3 backdrop-blur-md">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <div>
            <div className="text-sm font-semibold text-red-200">Помилка завантаження заявок</div>
            <p className="text-xs text-red-300/80 mt-1">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => loadLeads(false)}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-xs font-semibold text-red-200 rounded-xl transition-all"
          >
            Спробувати знову
          </button>
        </div>
      ) : filteredLeads.length === 0 ? (
        // Empty State
        <div className="p-8 bg-[#13161C]/40 backdrop-blur-xl border border-white/[0.08] rounded-3xl text-center space-y-3 my-4">
          <Inbox className="w-10 h-10 text-neutral-500 mx-auto stroke-1" />
          <div>
            <div className="text-sm font-semibold text-white">Заявок поки немає</div>
            <p className="text-xs text-neutral-400 mt-1">
              {activeFilter === 'all'
                ? 'Нові розрахунки ремонту від користувачів з’являться тут.'
                : 'Немає заявок з обраним фільтром статусу.'}
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
                className="bg-[#13161C]/60 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] p-4 rounded-3xl transition-all shadow-sm space-y-3"
              >
                {/* Header: Timestamp & Status */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    {lead.timestamp || 'Щойно'}
                  </span>
                  <div>{getStatusBadge(lead.status)}</div>
                </div>

                {/* Client Name & Username */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {lead.name || 'Клієнт без імені'}
                    </h3>
                    {lead.username && (
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {lead.username.startsWith('@') ? (
                          <a
                            href={`https://t.me/${lead.username.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400/90 hover:underline"
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
                    <div className="text-[10px] text-neutral-400 uppercase font-medium">
                      Кошторис
                    </div>
                    <div className="text-base font-extrabold text-amber-300">
                      {lead.total || '0 грн'}
                    </div>
                  </div>
                </div>

                {/* Object Parameters (Micro-Tags) */}
                <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/[0.05] space-y-1.5 text-xs text-neutral-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-400">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      Тип ремонту:
                    </span>
                    <span className="font-semibold text-white">
                      {lead.repairType || '—'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-400">
                      <Home className="w-3.5 h-3.5 text-amber-400" />
                      Об'єкт:
                    </span>
                    <span className="font-semibold text-white">
                      {lead.propertyType || '—'} ({lead.areaM2 ? `${lead.areaM2} м²` : '—'})
                    </span>
                  </div>

                  {lead.addons && lead.addons !== 'Без додаткових опцій' && (
                    <div className="pt-1.5 border-t border-white/[0.05]">
                      <div className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-neutral-300 leading-tight">
                          {lead.addons}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone Call Button */}
                <div className="pt-0.5">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="w-full py-2.5 px-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] border border-white/[0.08] text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-sm"
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { EmployeeRecord, FilterState, SyncStatus, getTeamLabel } from './types';
import { fetchSheetEmployees } from './services/sheetService';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { FilterPanel } from './components/FilterPanel';
import { EmployeeCard } from './components/EmployeeCard';
import { EmployeeCompactRow } from './components/EmployeeCompactRow';
import { Users, AlertTriangle, Layers } from 'lucide-react';

const AUTO_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export default function App() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('loading');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  const [filterState, setFilterState] = useState<FilterState>({
    team: 'all',
    status: 'all',
    title: 'all',
    search: '',
  });

  const loadData = useCallback(async () => {
    setSyncStatus('loading');
    try {
      const records = await fetchSheetEmployees();
      setEmployees(records);
      setSyncStatus('success');
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    } catch (err) {
      console.error('Error fetching sheet data:', err);
      setSyncStatus('error');
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, AUTO_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadData]);

  // Extract unique values for filters
  const teams = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.team))).filter((t): t is string => Boolean(t));
  }, [employees]);

  const titles = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.title)))
      .filter((t): t is string => Boolean(t))
      .sort();
  }, [employees]);

  const statuses = useMemo(() => {
    const rawStatuses = Array.from(new Set(employees.map((e) => e.status))).filter(
      (s): s is string => Boolean(s)
    );
    const standardOrder = [
      'Full Time',
      'Part Time',
      'From Part To Full Time',
      'From Full To Part Time',
      'Terminated',
    ];
    return rawStatuses.sort((a, b) => {
      const idxA = standardOrder.indexOf(a);
      const idxB = standardOrder.indexOf(b);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });
  }, [employees]);

  // Count employees per specialization/title
  const titleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach((emp) => {
      counts[emp.title] = (counts[emp.title] || 0) + 1;
    });
    return counts;
  }, [employees]);

  // Handle filter changes
  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilterState({
      team: 'all',
      status: 'all',
      title: 'all',
      search: '',
    });
  };

  // Filter logic
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Team filter
      if (filterState.team !== 'all' && emp.team !== filterState.team) {
        return false;
      }

      // Status filter
      if (filterState.status !== 'all') {
        if (filterState.status === 'Vacant') {
          if (!emp.isVacant) return false;
        } else {
          if (emp.isVacant || emp.status !== filterState.status) return false;
        }
      }

      // Specialization / Job Title filter (from Dropdown)
      if (filterState.title !== 'all' && emp.title !== filterState.title) {
        return false;
      }

      // Search query filter
      if (filterState.search.trim()) {
        const query = filterState.search.toLowerCase().trim();
        const haystack = [
          emp.name,
          emp.code,
          emp.title,
          emp.team,
          emp.sideTask || '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [employees, filterState]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Cairo',sans-serif]">
      {/* Top Hero / Header */}
      <Header
        syncStatus={syncStatus}
        lastUpdated={lastUpdated}
        onRefresh={loadData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* KPI Stats Bar */}
        <StatsBar
          data={employees}
          activeStatus={filterState.status}
          onSelectStatus={(status) => handleFilterChange({ status })}
        />

        {/* Filters Panel with the requested Specialization Dropdown */}
        <div className="mt-8">
          <FilterPanel
            teams={teams}
            statuses={statuses}
            titles={titles}
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            totalFiltered={filteredEmployees.length}
            totalAll={employees.length}
            titleCounts={titleCounts}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* Results Area */}
        {filteredEmployees.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              لا توجد نتائج مطابقة لمعايير البحث
            </h3>
            <p className="text-xs text-slate-500 mb-5 max-w-sm mx-auto">
              جرب تغيير التخصص المختار من القائمة المنسدلة، أو إعادة تعيين الفلاتر لعرض كافة السجلات.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Grouped by Team */}
            {teams.map((teamName) => {
              const teamRecords = filteredEmployees.filter((emp) => emp.team === teamName);
              if (teamRecords.length === 0) return null;

              return (
                <section key={teamName} className="space-y-4">
                  {/* Team Section Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs text-xs font-black">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Almarai',sans-serif] flex items-center gap-2">
                        <span>فريق {getTeamLabel(teamName)}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                          {teamRecords.length} سجل
                        </span>
                      </h2>
                    </div>
                    <div className="h-px bg-slate-200 flex-1 mr-3" />
                  </div>

                  {/* Employee Cards Grid or Compact View */}
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {teamRecords.map((emp, index) => (
                        <EmployeeCard
                          key={`${emp.team}-${emp.code || emp.name}-${index}`}
                          employee={emp}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {teamRecords.map((emp, index) => (
                        <EmployeeCompactRow
                          key={`${emp.team}-${emp.code || emp.name}-${index}`}
                          employee={emp}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">لوحة فريق ECQ التنظيمية</span>
            <span>•</span>
            <span>مزامنة مباشرة مع Google Sheets</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            التحديث التلقائي يعمل كل 5 دقائق · يمكنك الضغط على "تحديث الآن" في أي وقت
          </div>
        </div>
      </footer>
    </div>
  );
}

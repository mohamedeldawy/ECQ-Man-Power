import { FilterState, STATUS_LABELS, getTeamLabel } from '../types';
import { TitleDropdown } from './TitleDropdown';
import { Search, RotateCcw, Filter, LayoutGrid, List } from 'lucide-react';

interface FilterPanelProps {
  teams: string[];
  statuses: string[];
  titles: string[];
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  totalFiltered: number;
  totalAll: number;
  titleCounts: Record<string, number>;
  viewMode: 'grid' | 'compact';
  onViewModeChange: (mode: 'grid' | 'compact') => void;
}

export function FilterPanel({
  teams,
  statuses,
  titles,
  filterState,
  onFilterChange,
  onReset,
  totalFiltered,
  totalAll,
  titleCounts,
  viewMode,
  onViewModeChange,
}: FilterPanelProps) {
  const hasActiveFilters =
    filterState.team !== 'all' ||
    filterState.status !== 'all' ||
    filterState.title !== 'all' ||
    filterState.search !== '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 mb-7">
      {/* Top row: Team & Status Chips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5 pb-5 border-b border-slate-100">
        {/* Team Chips */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-xs font-bold text-slate-700">الفريق التنظيمي</span>
            <span className="text-[11px] text-slate-400">({teams.length} فرق)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onFilterChange({ team: 'all' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterState.team === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
              }`}
            >
              الكل
            </button>
            {teams.map((team) => {
              const isSelected = filterState.team === team;
              return (
                <button
                  key={team}
                  type="button"
                  onClick={() => onFilterChange({ team })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                  }`}
                >
                  فريق {getTeamLabel(team)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Chips */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-xs font-bold text-slate-700">حالة الدوام والعمل</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onFilterChange({ status: 'all' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterState.status === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
              }`}
            >
              جميع الحالات
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ status: 'Vacant' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterState.status === 'Vacant'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100/70 border border-purple-200/50'
              }`}
            >
              وظائف شاغرة
            </button>
            {statuses.map((status) => {
              const isSelected = filterState.status === status;
              const label = STATUS_LABELS[status] || status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onFilterChange({ status })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Second row: The Specialization Dropdown, Search Box & Reset Button */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
        {/* Title Dropdown - Prominent & clean */}
        <div className="md:col-span-6 lg:col-span-5">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            تصفية بالتخصص أو المسمى الوظيفي
          </label>
          <TitleDropdown
            titles={titles}
            selectedTitle={filterState.title}
            onSelectTitle={(title) => onFilterChange({ title })}
            titleCounts={titleCounts}
          />
        </div>

        {/* Search Box */}
        <div className="md:col-span-4 lg:col-span-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            بحث سريع بالاسم أو الكود
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="search-input"
              value={filterState.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="مثال: كريم، ECQ051، أو Flutter..."
              className="w-full pr-10 pl-3 py-2.5 text-xs bg-slate-50 hover:bg-white focus:bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 focus:outline-hidden transition-all text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Reset & View Controls */}
        <div className="md:col-span-2 lg:col-span-3 flex items-center justify-end gap-2 pt-1 md:pt-0">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/60">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              title="عرض شبكة الكروت"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('compact')}
              title="عرض مضغوط"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'compact' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
              title="إعادة ضبط جميع الفلاتر"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter status summary line */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-indigo-600" />
          <span>
            يتم عرض <strong className="text-slate-900 font-bold">{totalFiltered}</strong> سجل من أصل{' '}
            <strong className="text-slate-900 font-bold">{totalAll}</strong>
          </span>

          {filterState.title !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60">
              التخصص: {filterState.title}
            </span>
          )}
          {filterState.team !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
              الفريق: {getTeamLabel(filterState.team)}
            </span>
          )}
          {filterState.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">
              الحالة: {filterState.status === 'Vacant' ? 'شاغرة' : STATUS_LABELS[filterState.status] || filterState.status}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <span className="text-[11px] text-indigo-600 font-semibold">
            الفلاتر نشطة
          </span>
        )}
      </div>
    </div>
  );
}

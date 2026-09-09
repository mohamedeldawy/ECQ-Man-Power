import { SyncStatus } from '../types';
import { RefreshCw, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  syncStatus: SyncStatus;
  lastUpdated: string | null;
  onRefresh: () => void;
}

export function Header({ syncStatus, lastUpdated, onRefresh }: HeaderProps) {
  const isLoading = syncStatus === 'loading';

  return (
    <header className="relative bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden pb-12 pt-7 px-4 sm:px-6 lg:px-8 shadow-md">
      {/* Background ambient accents */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-sky-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Brand & Title Info */}
        <div className="flex items-center gap-4.5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0 shadow-lg shadow-black/20 ring-1 ring-white/20">
            <img
              src="https://logopng-omega.vercel.app/file.png"
              alt="شعار الشركة"
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                // fallback if image link fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="hidden text-indigo-950 font-black text-xl tracking-tighter">ECQ</span>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 text-xs font-medium mb-1.5 border border-white/10">
              <Sparkles className="w-3 h-3 text-indigo-300" />
              <span>فرق ECQ · الحصر والتوزيع التنظيمي</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight font-['Almarai',sans-serif]">
              لوحة متابعة فرق ECQ
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/90 mt-1 max-w-xl font-normal leading-relaxed">
              مربوطة مباشرة بالشيت الأصلي — أي تعديل في Google Sheets ينعكس فورياً هنا مع تحديث ذكي
              ودائم.
            </p>
          </div>
        </div>

        {/* Sync Status & Refresh Button */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200">
            {isLoading ? (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            ) : syncStatus === 'error' ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="font-medium">
              {isLoading
                ? 'جاري مزامنة الشيت...'
                : syncStatus === 'error'
                ? 'تعذر الاتصال بالشيت'
                : lastUpdated
                ? `آخر تحديث: ${lastUpdated}`
                : 'متصل ومحدث'}
            </span>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            id="refresh-sheet-btn"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>تحديث الآن</span>
          </button>
        </div>
      </div>
    </header>
  );
}

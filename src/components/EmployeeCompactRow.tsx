import { useState, MouseEvent } from 'react';
import { EmployeeRecord, STATUS_LABELS, getTeamLabel } from '../types';
import { Briefcase, Building2, Pin, Copy, Check, UserPlus } from 'lucide-react';

interface EmployeeCompactRowProps {
  employee: EmployeeRecord;
  key?: string;
}

export function EmployeeCompactRow({ employee }: EmployeeCompactRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: MouseEvent) => {
    e.stopPropagation();
    const details = `${employee.name} - ${employee.title} (${employee.team}) ${
      employee.code ? `[${employee.code}]` : ''
    }`;
    navigator.clipboard.writeText(details);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const getStatusBadge = () => {
    if (employee.isVacant) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 shrink-0">
          شاغرة
        </span>
      );
    }
    const label = STATUS_LABELS[employee.status] || employee.status;
    switch (employee.status) {
      case 'Full Time':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
            {label}
          </span>
        );
      case 'Part Time':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
            {label}
          </span>
        );
      case 'Terminated':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 shrink-0">
            {label}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200 shrink-0">
            {label}
          </span>
        );
    }
  };

  return (
    <div
      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-150 ${
        employee.isVacant
          ? 'bg-purple-50/30 border-purple-200 hover:border-purple-300'
          : 'bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-xs'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
            employee.isVacant
              ? 'bg-purple-100 text-purple-700'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
          }`}
        >
          {employee.isVacant ? <UserPlus className="w-4 h-4" /> : employee.code || 'ECQ'}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`font-bold text-sm truncate ${
                employee.isVacant ? 'text-purple-900' : 'text-slate-900'
              }`}
            >
              {employee.name}
            </span>
            {employee.code && (
              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                #{employee.code}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-slate-400" />
              <strong className="text-slate-700 font-semibold">{employee.title}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-400" />
              فريق {getTeamLabel(employee.team)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        {employee.sideTask && (
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs border border-amber-200 max-w-xs truncate"
            title={employee.sideTask}
          >
            <Pin className="w-3 h-3 text-amber-600 shrink-0" />
            <span className="truncate">{employee.sideTask}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="نسخ البيانات"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

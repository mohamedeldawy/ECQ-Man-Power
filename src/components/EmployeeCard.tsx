import { useState, MouseEvent } from 'react';
import { EmployeeRecord, STATUS_LABELS, getTeamLabel } from '../types';
import {
  Briefcase,
  Pin,
  User,
  UserPlus,
  Copy,
  Check,
  Building2,
  Clock,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { motion } from 'motion/react';

interface EmployeeCardProps {
  employee: EmployeeRecord;
  key?: string;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: MouseEvent) => {
    e.stopPropagation();
    const parts = [
      `${employee.name} - ${employee.title} (${getTeamLabel(employee.team)}) ${
        employee.code ? `[${employee.code}]` : ''
      }`,
    ];
    if (employee.workingHours) {
      parts.push(`مواعيد العمل: ${employee.workingHours}`);
    }
    if (employee.vacations) {
      parts.push(`الإجازة: ${employee.vacations}`);
    }
    navigator.clipboard.writeText(parts.join(' | '));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Status visual styles
  const getStatusConfig = () => {
    if (employee.isVacant) {
      const typeLabel =
        employee.status === 'Part Time'
          ? 'دوام جزئي'
          : employee.status === 'Full Time'
          ? 'دوام كامل'
          : STATUS_LABELS[employee.status] || employee.status;
      return {
        label: `شاغرة · ${typeLabel}`,
        bg: 'bg-purple-50 text-purple-700 border-purple-200/80',
        dot: 'bg-purple-500',
      };
    }

    switch (employee.status) {
      case 'Full Time':
        return {
          label: 'دوام كامل',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
        };
      case 'Part Time':
        return {
          label: 'دوام جزئي',
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500',
        };
      case 'From Part To Full Time':
        return {
          label: 'تحويل لدوام كامل',
          bg: 'bg-sky-50 text-sky-700 border-sky-200/80',
          dot: 'bg-sky-500',
        };
      case 'From Full To Part Time':
        return {
          label: 'تحويل لدوام جزئي',
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
      case 'Terminated':
        return {
          label: 'انتهت الخدمة',
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500',
        };
      default:
        return {
          label: employee.status,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  // Team visual styling
  const getTeamColor = (team: string) => {
    switch (team) {
      case 'Senior Team':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'Middle Team':
        return 'bg-teal-50 text-teal-700 border-teal-200/60';
      case 'Junior Team':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
      case 'Bachelor Team':
        return 'bg-violet-50 text-violet-700 border-violet-200/60';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200/60';
    }
  };

  const statusConfig = getStatusConfig();
  const teamColor = getTeamColor(employee.team);

  // Generate initials for avatar
  const getInitials = (name: string) => {
    if (!name) return 'ECQ';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]} ${parts[1][0]}`;
    }
    return name.slice(0, 2);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex flex-col justify-between rounded-2xl p-4.5 transition-all duration-200 ${
        employee.isVacant
          ? 'bg-linear-to-b from-purple-50/40 to-white border-2 border-dashed border-purple-200 hover:border-purple-300 shadow-xs'
          : employee.status === 'Terminated'
          ? 'bg-white border border-slate-200 opacity-75 hover:opacity-100 shadow-xs hover:shadow-md'
          : 'bg-white border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-lg hover:-translate-y-0.5'
      }`}
    >
      <div>
        {/* Top Header: Team Badge & Status Pill */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${teamColor}`}
          >
            <Building2 className="w-3 h-3 opacity-70" />
            فريق {getTeamLabel(employee.team)}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-bold border ${statusConfig.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
            {statusConfig.label}
          </span>
        </div>

        {/* Profile Info Header */}
        <div className="flex items-start gap-3 mb-3.5">
          {/* Avatar / Icon */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm shadow-xs transition-transform duration-200 group-hover:scale-105 ${
              employee.isVacant
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : employee.status === 'Terminated'
                ? 'bg-slate-100 text-slate-500 border border-slate-200'
                : 'bg-linear-to-br from-indigo-500 to-indigo-700 text-white shadow-indigo-200'
            }`}
          >
            {employee.isVacant ? (
              <UserPlus className="w-5 h-5" />
            ) : employee.code ? (
              <span className="font-mono text-xs font-bold">{getInitials(employee.name)}</span>
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>

          {/* Name & Code */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3
                className={`text-base font-bold truncate ${
                  employee.isVacant
                    ? 'text-purple-900 font-semibold'
                    : employee.status === 'Terminated'
                    ? 'text-slate-600 line-through'
                    : 'text-slate-900'
                }`}
                title={employee.name}
              >
                {employee.name}
              </h3>

              {employee.code && (
                <button
                  type="button"
                  onClick={handleCopy}
                  title="نسخ كود الموظف وبياناته"
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 font-mono text-[11px] font-medium transition-colors"
                >
                  <span>#{employee.code}</span>
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 opacity-60" />
                  )}
                </button>
              )}
            </div>

            {/* Specialization / Job Title Pill */}
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                <Briefcase className="w-3 h-3" />
              </span>
              <span className="font-semibold text-slate-800 truncate" title={employee.title}>
                {employee.title}
              </span>
            </div>
          </div>
        </div>

        {/* Working Hours & Vacations Details */}
        {(employee.workingHours || employee.vacations) && (
          <div className="mt-3 flex flex-col gap-1.5 text-xs">
            {employee.workingHours && (
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-900">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="font-bold text-[11px] text-emerald-800 shrink-0">
                    مواعيد العمل:
                  </span>
                  <span className="font-semibold text-[11.5px] truncate font-mono" dir="ltr">
                    {employee.workingHours}
                  </span>
                </div>
              </div>
            )}

            {employee.vacations && (
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-sky-50/80 border border-sky-200/80 text-sky-900">
                <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="font-bold text-[11px] text-sky-800 shrink-0">
                    الإجازة الأسبوعية:
                  </span>
                  <span className="font-semibold text-[11.5px] truncate">
                    {employee.vacations}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Side Task (المهمة الجانبية / التكليف الإضافي) */}
        {employee.sideTask && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs flex items-start gap-2">
            <div className="p-1 rounded-md bg-amber-100 text-amber-700 shrink-0 mt-0.5">
              <Pin className="w-3 h-3" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-amber-900 block text-[11px] mb-0.5">
                تكليف إضافي:
              </span>
              <p className="leading-relaxed text-[12px] text-amber-900/90">{employee.sideTask}</p>
            </div>
          </div>
        )}

        {/* Vacant Badge for Hiring Status */}
        {employee.isVacant && (
          <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span className="font-medium text-[11.5px]">
              شاغر متاح للتوظيف - يتم استقبال الترشيحات
            </span>
          </div>
        )}
      </div>

      {/* Card Footer / Quick Action Bar */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span>{STATUS_LABELS[employee.status] || employee.status}</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium cursor-pointer"
        >
          {copied ? (
            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
              <Check className="w-3 h-3" /> تم النسخ
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Copy className="w-3 h-3" /> نسخ البيانات
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
}

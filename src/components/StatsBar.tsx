import { Users, UserPlus, Briefcase, Clock, UserX } from 'lucide-react';
import { EmployeeRecord } from '../types';

interface StatsBarProps {
  data: EmployeeRecord[];
  activeStatus: string;
  onSelectStatus: (status: string) => void;
}

export function StatsBar({ data, activeStatus, onSelectStatus }: StatsBarProps) {
  const totalCount = data.length;
  const vacantCount = data.filter((d) => d.isVacant).length;
  const fullTimeCount = data.filter(
    (d) => !d.isVacant && (d.status === 'Full Time' || d.status === 'From Part To Full Time')
  ).length;
  const partTimeCount = data.filter(
    (d) => !d.isVacant && (d.status === 'Part Time' || d.status === 'From Full To Part Time')
  ).length;
  const termCount = data.filter((d) => d.status === 'Terminated').length;

  const stats = [
    {
      id: 'all',
      title: 'إجمالي السجلات',
      count: totalCount,
      icon: Users,
      color: 'border-slate-800 text-slate-800 bg-white',
      badgeBg: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'Vacant',
      title: 'وظائف شاغرة',
      count: vacantCount,
      icon: UserPlus,
      color: 'border-purple-600 text-purple-700 bg-white',
      badgeBg: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'Full Time',
      title: 'دوام كامل نشط',
      count: fullTimeCount,
      icon: Briefcase,
      color: 'border-emerald-600 text-emerald-700 bg-white',
      badgeBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'Part Time',
      title: 'دوام جزئي نشط',
      count: partTimeCount,
      icon: Clock,
      color: 'border-amber-600 text-amber-700 bg-white',
      badgeBg: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'Terminated',
      title: 'انتهت خدمتهم',
      count: termCount,
      icon: UserX,
      color: 'border-rose-600 text-rose-700 bg-white',
      badgeBg: 'bg-rose-100 text-rose-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 -mt-6 relative z-10">
      {stats.map((item) => {
        const Icon = item.icon;
        const isSelected = activeStatus === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onSelectStatus(isSelected && item.id !== 'all' ? 'all' : item.id);
            }}
            className={`flex flex-col text-right p-4 rounded-2xl border-r-4 transition-all duration-200 cursor-pointer text-slate-900 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
              item.color
            } ${
              isSelected
                ? 'ring-2 ring-indigo-500 shadow-md bg-indigo-50/20'
                : 'border-t border-b border-l border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-2xl font-black font-['Almarai',sans-serif] tracking-tight">
                {item.count}
              </span>
              <div className={`p-2 rounded-xl shrink-0 ${item.badgeBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500 truncate">{item.title}</span>
          </button>
        );
      })}
    </div>
  );
}

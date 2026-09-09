export interface EmployeeRecord {
  team: string;
  title: string;
  status: string;
  isVacant: boolean;
  code: string;
  name: string;
  sideTask?: string;
}

export interface FilterState {
  team: string;
  status: string;
  title: string;
  search: string;
}

export type SyncStatus = 'idle' | 'loading' | 'success' | 'error';

export const STATUS_LABELS: Record<string, string> = {
  'Full Time': 'دوام كامل',
  'Part Time': 'دوام جزئي',
  'From Part To Full Time': 'تحويل لدوام كامل',
  'From Full To Part Time': 'تحويل لدوام جزئي',
  'Terminated': 'انتهت الخدمة',
};

export const TEAM_LABELS_KNOWN: Record<string, string> = {
  'Junior Team': 'جونيور',
  'Middle Team': 'ميدل',
  'Senior Team': 'سينيور',
  'Bachelor Team': 'بكالوريوس',
};

export function getTeamLabel(team: string): string {
  return TEAM_LABELS_KNOWN[team] || team;
}

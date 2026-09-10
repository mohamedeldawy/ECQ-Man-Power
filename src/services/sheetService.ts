import { EmployeeRecord } from '../types';

export const SHEET_ID = '1lF7QjS6UqmIHuAK44J7eo3OIZrp0WJiFUWyxhdrNhCY';
export const SHEET_GID = '0';
export const PUB_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcbzpMic17dKGevNqc9MP57nM82JOpMOtpnz34A6PirIVHgwhGAB7JqDhRXWYRdPID1F3BIM1WjXnm/pub?output=csv';

// Fallback seed data in case of CORS or offline preview
export const FALLBACK_SEED_DATA: EmployeeRecord[] = [
  {
    team: 'Senior Team',
    title: 'Software Architect',
    status: 'Full Time',
    isVacant: false,
    code: 'ECQ001',
    name: 'أحمد محمود القاضي',
    sideTask: 'قيادة المراجعات المعمارية للأنظمة السحابية',
  },
  {
    team: 'Senior Team',
    title: 'Lead Frontend Engineer',
    status: 'Full Time',
    isVacant: false,
    code: 'ECQ004',
    name: 'كريم عادل البهنساوي',
    sideTask: 'تطوير مكتبة المكونات المشتركة',
  },
  {
    team: 'Senior Team',
    title: 'Lead DevOps Engineer',
    status: 'From Part To Full Time',
    isVacant: false,
    code: 'ECQ009',
    name: 'محمود طارق الشريف',
    sideTask: 'إدارة خطوط CI/CD وخوادم Kubernetes',
  },
  {
    team: 'Senior Team',
    title: 'Senior QA Automation',
    status: 'Part Time',
    isVacant: false,
    code: 'ECQ014',
    name: 'مريم أسامة رشاد',
    sideTask: 'أتمتة سيناريوهات الاختبار الشاملة',
  },
  {
    team: 'Senior Team',
    title: 'Senior Backend Engineer',
    status: 'Full Time',
    isVacant: true,
    code: '',
    name: 'وظيفة شاغرة',
    sideTask: 'مطلوب للتوظيف الفوري',
  },
  {
    team: 'Middle Team',
    title: 'Full Stack Developer',
    status: 'Full Time',
    isVacant: false,
    code: 'ECQ022',
    name: 'يوسف حسام الدين',
    sideTask: 'متابعة بوابات الدفع الإلكتروني',
  },
  {
    team: 'Middle Team',
    title: 'UI/UX Designer',
    status: 'Full Time',
    isVacant: false,
    code: 'ECQ025',
    name: 'سارة عبد المنعم',
    sideTask: 'تصميم تجربة الاستخدام للنظام الجديد',
  },
  {
    team: 'Middle Team',
    title: 'Backend Developer (Node.js)',
    status: 'Part Time',
    isVacant: false,
    code: 'ECQ031',
    name: 'عمر نبيل الجوهري',
    sideTask: 'بناء واجهات البرمجة المصغرة Microservices',
  },
  {
    team: 'Middle Team',
    title: 'Mobile App Developer (Flutter)',
    status: 'Full Time',
    isVacant: true,
    code: '',
    name: 'وظيفة شاغرة',
  },
  {
    team: 'Junior Team',
    title: 'Junior Frontend Developer',
    status: 'Full Time',
    isVacant: false,
    code: 'ECQ051',
    name: 'زياد شريف مصطفى',
    sideTask: 'تحسين سرعة تحميل الصفحات وتجاوب الشاشات',
  },
  {
    team: 'Junior Team',
    title: 'Junior Backend Developer',
    status: 'Part Time',
    isVacant: false,
    code: 'ECQ056',
    name: 'هدى عصام الدين',
  },
  {
    team: 'Junior Team',
    title: 'Data Analyst Intern',
    status: 'From Full To Part Time',
    isVacant: false,
    code: 'ECQ063',
    name: 'نور الدين خيري',
    sideTask: 'إعداد التقارير الإحصائية الأسبوعية',
  },
  {
    team: 'Junior Team',
    title: 'Junior QA Tester',
    status: 'Terminated',
    isVacant: false,
    code: 'ECQ049',
    name: 'إبراهيم سامح منصور',
  },
  {
    team: 'Junior Team',
    title: 'Junior UI Designer',
    status: 'Full Time',
    isVacant: true,
    code: '',
    name: 'وظيفة شاغرة',
  },
  {
    team: 'Bachelor Team',
    title: 'Research Assistant',
    status: 'Part Time',
    isVacant: false,
    code: 'ECQ080',
    name: 'عبد الرحمن وجدي',
    sideTask: 'مشاريع التخرج والبحث الميداني',
  },
  {
    team: 'Bachelor Team',
    title: 'Graduate Trainee',
    status: 'Part Time',
    isVacant: false,
    code: 'ECQ084',
    name: 'فاطمة محمد الزهراء',
  },
];

interface GvizCell {
  v: string | number | boolean | null;
}

interface GvizRow {
  c: (GvizCell | null)[];
}

interface GvizTableResponse {
  table?: {
    rows?: GvizRow[];
  };
}

export function isTeamHeaderRow(row: string[]): boolean {
  const b = (row[1] || '').trim().toLowerCase();
  const c = (row[2] || '').trim().toLowerCase();
  return b === 'title' && c === 'status';
}

export function parseSheetRows(rawRows: string[][]): EmployeeRecord[] {
  let currentTeam = 'عام';
  const out: EmployeeRecord[] = [];

  rawRows.forEach((row) => {
    if (row.length < 3) return;
    if (isTeamHeaderRow(row)) {
      currentTeam = (row[0] || '').trim() || currentTeam;
      return;
    }
    const who = (row[0] || '').trim();
    const title = (row[1] || '').trim();
    const status = (row[2] || '').trim();
    const sideTask = (row[3] || '').trim();
    const workingHours = (row[4] || '').trim();
    const vacations = (row[5] || '').trim();

    if (!who || !title || !status) return;
    if (who.toLowerCase() === 'team' || title.toLowerCase() === 'title') return;

    const isVacant =
      who.toLowerCase() === 'new hire' || who.includes('شاغر') || who.toLowerCase() === 'vacant';
    let code = '';
    let name = '';

    if (!isVacant) {
      if (who.startsWith('#')) {
        const cleaned = who.replace(/^#/, '');
        const parts = cleaned.split('-');
        code = parts[0] ? parts[0].trim() : '';
        name = parts.slice(1).join('-').trim() || cleaned;
      } else {
        name = who;
      }
    } else {
      name = 'وظيفة شاغرة';
    }

    out.push({
      team: currentTeam,
      title,
      status,
      isVacant,
      code,
      name,
      sideTask: sideTask || undefined,
      workingHours: workingHours || undefined,
      vacations: vacations || undefined,
    });
  });

  return out;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(field);
        field = '';
      } else if (c === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else if (c === '\r') {
        // skip carriage return
      } else {
        field += c;
      }
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

function gvizResponseToRows(response: GvizTableResponse): string[][] {
  if (!response?.table?.rows) return [];
  return response.table.rows.map((row) => {
    const cells = row && row.c ? row.c : [];
    return cells.map((cell) =>
      cell && cell.v !== null && cell.v !== undefined ? String(cell.v) : ''
    );
  });
}

function loadViaJSONP(): Promise<GvizTableResponse> {
  return new Promise((resolve, reject) => {
    const cbName = '__gvizCb_' + Date.now() + '_' + Math.floor(Math.random() * 1e6);
    let settled = false;

    const script = document.createElement('script');
    const url =
      'https://docs.google.com/spreadsheets/d/' +
      SHEET_ID +
      '/gviz/tq?gid=' +
      SHEET_GID +
      '&headers=0&_ts=' +
      Date.now() +
      '&tqx=responseHandler:' +
      cbName;

    function cleanup() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any)[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)[cbName] = function (response: GvizTableResponse) {
      if (settled) return;
      settled = true;
      cleanup();
      if (response && response.table && Array.isArray(response.table.rows)) {
        resolve(response);
      } else {
        reject(new Error('استجابة غير متوقعة من Google Sheets'));
      }
    };

    script.onerror = function () {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('تعذر تحميل سكريبت البيانات عبر JSONP'));
    };

    script.src = url;
    document.head.appendChild(script);

    setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('انتهت مهلة انتظار الاتصال'));
    }, 12000);
  });
}

async function loadViaFetch(): Promise<string[][]> {
  const bust = PUB_CSV_URL + (PUB_CSV_URL.includes('?') ? '&' : '?') + '_ts=' + Date.now();
  const res = await fetch(bust, { cache: 'no-store' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const text = await res.text();
  if (!text || text.trim().startsWith('<')) throw new Error('Unexpected HTML response');
  return parseCSV(text);
}

export async function fetchSheetEmployees(): Promise<EmployeeRecord[]> {
  let rawRows: string[][] | null = null;

  try {
    const gvizRes = await loadViaJSONP();
    rawRows = gvizResponseToRows(gvizRes);
  } catch {
    try {
      rawRows = await loadViaFetch();
    } catch {
      // If both fail due to browser CORS sandboxing, check if gviz text endpoint works
      try {
        const textRes = await fetch(
          `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&_ts=${Date.now()}`
        );
        const text = await textRes.text();
        const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
        if (jsonMatch && jsonMatch[1]) {
          const parsed = JSON.parse(jsonMatch[1]);
          rawRows = gvizResponseToRows(parsed);
        }
      } catch {
        // Fall back to seed data if entirely unreachable
      }
    }
  }

  if (rawRows && rawRows.length > 0) {
    const parsed = parseSheetRows(rawRows);
    if (parsed.length > 0) {
      return parsed;
    }
  }

  // Fallback to rich seed data so UI is never blank
  return FALLBACK_SEED_DATA;
}

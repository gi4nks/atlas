import { AppData } from '@/types/app';

function formatDate(date: any): string {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  if (typeof date === 'string' && date.includes('T')) {
      return date.split('T')[0];
  }
  return date ? String(date) : '';
}

export function normalizeAppData(data: AppData): AppData {
  return {
    ...data,
    dates: {
      created: formatDate(data.dates.created),
      last_update: formatDate(data.dates.last_update),
    },
  };
}

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { AppData } from '@/types/app';

const appsDirectory = path.join(process.cwd(), '..', 'apps');

function formatDate(date: any): string {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return date ? String(date) : '';
}

function normalizeAppData(data: any): AppData {
  return {
    ...data,
    dates: {
      created: formatDate(data.dates?.created),
      last_update: formatDate(data.dates?.last_update),
    },
    // Ensure arrays are arrays (defensive coding)
    tags: Array.isArray(data.tags) ? data.tags : [],
    known_issues: Array.isArray(data.known_issues) ? data.known_issues : [],
    next_steps: Array.isArray(data.next_steps) ? data.next_steps : [],
    future_ideas: Array.isArray(data.future_ideas) ? data.future_ideas : [],
    dependencies: {
        services: Array.isArray(data.dependencies?.services) ? data.dependencies.services : [],
        env_vars: Array.isArray(data.dependencies?.env_vars) ? data.dependencies.env_vars : [],
    }
  } as AppData;
}

export function getAllApps(): AppData[] {
  if (!fs.existsSync(appsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(appsDirectory);
  const allAppsData = fileNames
    .filter((fileName) => fileName.endsWith('.yml'))
    .map((fileName) => {
      const fullPath = path.join(appsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const appDataRaw = yaml.load(fileContents);
      return normalizeAppData(appDataRaw);
    });

  return allAppsData.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
}

export function getAppData(id: string): AppData | null {
  const fullPath = path.join(appsDirectory, `${id}.yml`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const appDataRaw = yaml.load(fileContents);
  
  return normalizeAppData(appDataRaw);
}
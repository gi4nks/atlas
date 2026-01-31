import { discoverYamlFiles } from './discovery';
import { readAppFile } from './reader';
import { parseAppYaml } from './parser';
import { normalizeAppData } from './normalizer';
import { AppData } from '@/types/app';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

export class AppRepository {
  async getAll(): Promise<AppData[]> {
    const files = await discoverYamlFiles();
    
    const apps = await Promise.all(
      files.map(async (file) => {
        try {
          const content = await readAppFile(file);
          if (!content) return null;
          const parsed = parseAppYaml(content);
          return normalizeAppData(parsed);
        } catch (error) {
          console.error(`Error processing ${file}:`, error);
          return null;
        }
      })
    );
    
    return apps
      .filter((app): app is AppData => app !== null)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getById(id: string): Promise<AppData | null> {
    try {
      const content = await readAppFile(`${id}.yml`);
      if (!content) return null;
      const parsed = parseAppYaml(content);
      return normalizeAppData(parsed);
    } catch (error) {
      console.error(`Error processing app ${id}:`, error);
      return null;
    }
  }
}

const repo = new AppRepository();

/**
 * Cached version of getAll for Next.js
 */
export const getAllApps = unstable_cache(
  () => repo.getAll(),
  ['all-apps'],
  { revalidate: 3600, tags: ['apps'] }
);

/**
 * Cached version of getById for React
 */
export const getAppData = cache((id: string) => {
    return unstable_cache(
        () => repo.getById(id),
        [`app-${id}`],
        { revalidate: 3600, tags: ['apps', `app-${id}`] }
    )();
});

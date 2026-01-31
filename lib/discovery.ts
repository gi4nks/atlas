import fs from 'fs/promises';
import { existsSync } from 'fs';
import { APPS_DIR } from './config';

export async function discoverYamlFiles(): Promise<string[]> {
  if (!existsSync(APPS_DIR)) {
    return [];
  }
  
  const fileNames = await fs.readdir(APPS_DIR);
  return fileNames.filter((fileName) => fileName.endsWith('.yml'));
}

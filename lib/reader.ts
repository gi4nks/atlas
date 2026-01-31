import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { APPS_DIR } from './config';

export async function readAppFile(fileName: string): Promise<string | null> {
  const fullPath = fileName.includes(path.sep) ? fileName : path.join(APPS_DIR, fileName);
  
  if (!existsSync(fullPath)) {
    return null;
  }
  
  return fs.readFile(fullPath, 'utf8');
}

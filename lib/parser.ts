import yaml from 'js-yaml';
import { AppDataSchema } from './schemas';
import { AppData } from '@/types/app';

export function parseAppYaml(content: string): AppData {
  const rawData = yaml.load(content);
  return AppDataSchema.parse(rawData) as AppData;
}

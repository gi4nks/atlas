import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { AppData } from '@/types/app';
import { AppDataSchema } from './schemas';
import { APPS_DIR } from './config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function getApps(): Promise<AppData[]> {
  try {
    const files = await fs.readdir(APPS_DIR);
    const yamlFiles = files.filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
    
    const apps = await Promise.all(
      yamlFiles.map(async (file) => {
        const content = await fs.readFile(path.join(APPS_DIR, file), 'utf8');
        const parsed = yaml.load(content) as any;
        const validated = AppDataSchema.safeParse(parsed);
        return validated.success ? validated.data : null;
      })
    );
    
    return apps
      .filter((app): app is AppData => app !== null)
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) {
    return [];
  }
}

export async function getAppById(id: string): Promise<AppData | null> {
  try {
    const filePath = path.join(APPS_DIR, `${id}.yml`);
    const content = await fs.readFile(filePath, 'utf8');
    const parsed = yaml.load(content) as any;
    const validated = AppDataSchema.safeParse(parsed);
    return validated.success ? validated.data : null;
  } catch (e) {
    return null;
  }
}

export async function saveApp(data: AppData): Promise<void> {
  const validated = AppDataSchema.parse(data);
  const yamlStr = yaml.dump(validated, { lineWidth: -1, noRefs: true });
  await fs.writeFile(path.join(APPS_DIR, `${validated.id}.yml`), yamlStr);
}

export async function smartScan(directoryPath: string): Promise<Partial<AppData>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY non configurata');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Leggiamo file chiave per dare contesto all'AI
  let context = `Directory Path: ${directoryPath}
`;
  const filesToRead = ['README.md', 'package.json', 'go.mod'];
  
  for (const file of filesToRead) {
    try {
      const fullPath = path.join(directoryPath, file);
      const content = await fs.readFile(fullPath, 'utf8');
      context += `
--- File: ${file} ---
${content.slice(0, 1500)}
`;
    } catch (e) {}
  }

  const prompt = `
    Analizza questo progetto software e genera un file YAML seguendo questo schema:
    id: (slug della cartella)
    name: (Nome leggibile)
    description: (max 2 frasi)
    status: (idea|prototype|mvp|beta|production)
    category: (personal|work|experiment)
    stack: { frontend: string, backend: string, database: string, infra: string }
    
    Ritorna SOLO lo YAML valido.
    
    CONTESTO:
    ${context}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text().replace(/```yaml/g, '').replace(/```/g, '').trim();
  
  return yaml.load(text) as Partial<AppData>;
}

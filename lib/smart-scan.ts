import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const APPS_DIR = path.join(process.cwd(), '..', 'apps');
const TEMPLATE_PATH = path.join(process.cwd(), '..', 'templates', 'app.template.yml');
const BASE_DIR = path.join(process.cwd(), '..');

async function main() {
    const targetDir = process.argv[2];

    if (!process.env.GEMINI_API_KEY) {
        console.error('Error: GEMINI_API_KEY not found in .env');
        process.exit(1);
    }

    if (!targetDir) {
        console.error('Usage: npm run smart-scan <directory-name>');
        process.exit(1);
    }

    const fullPath = path.join(BASE_DIR, targetDir);
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
        console.error(`Error: Directory "${targetDir}" not found in ${BASE_DIR}`);
        process.exit(1);
    }

    console.log(`🤖 Smart Scanning ${targetDir} with Gemini...`);

    // Collect context for Gemini
    let context = `Directory Name: ${targetDir}\n`;
    
    const filesToRead = ['README.md', 'package.json', 'go.mod', 'GEMINI.md', 'PLAN.md'];
    for (const file of filesToRead) {
        const filePath = path.join(fullPath, file);
        if (fs.existsSync(filePath)) {
            context += `\n--- File: ${file} ---\n`;
            context += fs.readFileSync(filePath, 'utf8').slice(0, 2000); // Grab first 2k chars
        }
    }

    const templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
    You are a senior software architect. Analyze the provided file contents of a software project directory named "${targetDir}".
Generate a YAML configuration for this application following the provided template.

RULES:
1. Return ONLY the valid YAML. No markdown blocks, no explanations.
2. The 'id' must be "${targetDir}".
3. Description must be max 3 lines.
4. If Next.js is used, set backend to null (as it's a fullstack framework).
5. Be smart about 'category' and 'status' based on the context.
6. Extract 'next_steps', 'known_issues', and 'future_ideas' if found in the text.
7. Set 'dates.last_update' to today: ${new Date().toISOString().split('T')[0]}.

TEMPLATE:
${templateContent}

CONTEXT FROM PROJECT FILES:
${context}
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean up markdown code blocks if Gemini includes them
        text = text.replace(/```yaml/g, '').replace(/```/g, '').trim();

        const outputPath = path.join(APPS_DIR, `${targetDir}.yml`);
        fs.writeFileSync(outputPath, text);
        console.log(`✅ Success! Smart YAML created at ${outputPath}`);
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        process.exit(1);
    }
}

main().catch(console.error);

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { AppData } from '../types/app';
import { APPS_DIR, TEMPLATE_PATH } from './config';

const BASE_DIR = path.join(APPS_DIR, '..');

/**
 * Basic scanner to guess app info from a directory
 */
async function scanDirectory(dirName: string): Promise<Partial<AppData>> {
    const fullPath = path.join(BASE_DIR, dirName);
    const stats = await fs.stat(fullPath);
    
    const hasPackageJson = existsSync(path.join(fullPath, 'package.json'));
    const hasGoMod = existsSync(path.join(fullPath, 'go.mod'));
    const hasDockerfile = existsSync(path.join(fullPath, 'Dockerfile')) || existsSync(path.join(fullPath, 'docker-compose.yml'));
    const hasReadme = existsSync(path.join(fullPath, 'README.md'));
    
    let frontend = null;
    let backend = null;
    
    if (hasPackageJson) {
        const pkgContent = await fs.readFile(path.join(fullPath, 'package.json'), 'utf8');
        const pkg = JSON.parse(pkgContent);
        if (pkg.dependencies?.next) frontend = 'Next.js';
        else if (pkg.dependencies?.react) frontend = 'React';
    }
    
    if (hasGoMod) {
        backend = 'Go';
    }

    return {
        id: dirName,
        name: dirName.charAt(0).toUpperCase() + dirName.slice(1),
        stack: {
            frontend,
            backend,
            database: null,
            infra: hasDockerfile ? 'Docker' : null
        },
        health: {
            has_tests: existsSync(path.join(fullPath, 'tests')) || existsSync(path.join(fullPath, 'test')),
            has_ci: existsSync(path.join(fullPath, '.github')) || existsSync(path.join(fullPath, '.gitlab-ci.yml')),
            has_docker: hasDockerfile,
            has_readme: hasReadme
        },
        dates: {
            created: stats.birthtime.toISOString().split('T')[0],
            last_update: stats.mtime.toISOString().split('T')[0]
        }
    };
}

async function main() {
    const targetDir = process.argv[2];

    if (!targetDir) {
        console.error('Usage: npm run scan <directory-name>');
        process.exit(1);
    }

    const fullPath = path.join(BASE_DIR, targetDir);
    if (!existsSync(fullPath)) {
        console.error(`Error: Directory "${targetDir}" not found in ${BASE_DIR}`);
        process.exit(1);
    }
    
    const stats = await fs.stat(fullPath);
    if (!stats.isDirectory()) {
        console.error(`Error: "${targetDir}" is not a directory.`);
        process.exit(1);
    }

    if (existsSync(path.join(APPS_DIR, `${targetDir}.yml`))) {
        console.error(`Error: YAML for "${targetDir}" already exists in apps/`);
        process.exit(1);
    }

    console.log(`Scanning ${targetDir}...`);
    const guessedData = await scanDirectory(targetDir);
    const templateContent = await fs.readFile(TEMPLATE_PATH, 'utf8');
    const template = yaml.load(templateContent) as any;

    // Merge template with guessed data
    const finalData = {
        ...template,
        ...guessedData,
        stack: { ...template.stack, ...guessedData.stack },
        health: { ...template.health, ...guessedData.health },
        dates: { ...template.dates, ...guessedData.dates }
    };

    const yamlStr = yaml.dump(finalData, { lineWidth: -1 });
    const outputPath = path.join(APPS_DIR, `${targetDir}.yml`);
    
    await fs.writeFile(outputPath, yamlStr);
    console.log(`✅ Success! Created ${outputPath}`);
}

main().catch(console.error);


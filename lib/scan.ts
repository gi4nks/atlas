import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { AppData } from '../types/app';

const APPS_DIR = path.join(process.cwd(), '..', 'apps');
const TEMPLATE_PATH = path.join(process.cwd(), '..', 'templates', 'app.template.yml');
const BASE_DIR = path.join(process.cwd(), '..');

/**
 * Basic scanner to guess app info from a directory
 */
function scanDirectory(dirName: string): Partial<AppData> {
    const fullPath = path.join(BASE_DIR, dirName);
    const stats = fs.statSync(fullPath);
    
    const hasPackageJson = fs.existsSync(path.join(fullPath, 'package.json'));
    const hasGoMod = fs.existsSync(path.join(fullPath, 'go.mod'));
    const hasDockerfile = fs.existsSync(path.join(fullPath, 'Dockerfile')) || fs.existsSync(path.join(fullPath, 'docker-compose.yml'));
    const hasReadme = fs.existsSync(path.join(fullPath, 'README.md'));
    
    let frontend = null;
    let backend = null;
    
    if (hasPackageJson) {
        const pkg = JSON.parse(fs.readFileSync(path.join(fullPath, 'package.json'), 'utf8'));
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
            has_tests: fs.existsSync(path.join(fullPath, 'tests')) || fs.existsSync(path.join(fullPath, 'test')),
            has_ci: fs.existsSync(path.join(fullPath, '.github')) || fs.existsSync(path.join(fullPath, '.gitlab-ci.yml')),
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
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
        console.error(`Error: Directory "${targetDir}" not found in ${BASE_DIR}`);
        process.exit(1);
    }

    if (fs.existsSync(path.join(APPS_DIR, `${targetDir}.yml`))) {
        console.error(`Error: YAML for "${targetDir}" already exists in apps/`);
        process.exit(1);
    }

    console.log(`Scanning ${targetDir}...`);
    const guessedData = scanDirectory(targetDir);
    const template = yaml.load(fs.readFileSync(TEMPLATE_PATH, 'utf8')) as any;

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
    
    fs.writeFileSync(outputPath, yamlStr);
    console.log(`✅ Success! Created ${outputPath}`);
}

main().catch(console.error);

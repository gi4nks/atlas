import path from 'path';

export const APPS_DIR = process.env.APPS_DIR || path.join(process.cwd(), '..', 'apps');
export const TEMPLATES_DIR = process.env.TEMPLATES_DIR || path.join(process.cwd(), '..', 'templates');
export const TEMPLATE_PATH = path.join(TEMPLATES_DIR, 'app.template.yml');

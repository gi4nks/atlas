import { z } from 'zod';

export const AppStatusSchema = z.enum(['idea', 'prototype', 'mvp', 'beta', 'production', 'paused', 'abandoned']);
export const AppCategorySchema = z.enum(['personal', 'work', 'experiment', 'archived']).or(z.string()).default('experiment');
export const VersionStrategySchema = z.enum(['none', 'semver', 'date']).default('none');
export const RepoTypeSchema = z.enum(['github', 'gitlab', 'local']).default('local');

const DateSchema = z.union([z.string(), z.date()]).transform((val) => {
  if (val instanceof Date) {
    return val.toISOString().split('T')[0];
  }
  return val;
});

export const AppVersionSchema = z.object({
  current: z.string().default('0.1.0'),
  strategy: VersionStrategySchema,
});

export const AppStackSchema = z.object({
  frontend: z.string().nullable().default(null),
  backend: z.string().nullable().default(null),
  database: z.string().nullable().default(null),
  infra: z.string().nullable().default(null),
});

export const AppRepositorySchema = z.object({
  type: RepoTypeSchema,
  url: z.string().nullable().default(null),
});

export const AppDatesSchema = z.object({
  created: DateSchema,
  last_update: DateSchema,
});

export const AppRunSchema = z.object({
  local: z.string().nullable().transform(v => v ?? 'npm start'),
  docker: z.string().nullable().default(null),
});

export const AppDependenciesSchema = z.object({
  services: z.array(z.string()).default([]),
  env_vars: z.array(z.string()).default([]),
}).default({ services: [], env_vars: [] });

export const AppHealthSchema = z.object({
  has_tests: z.boolean().default(false),
  has_ci: z.boolean().default(false),
  has_docker: z.boolean().default(false),
  has_readme: z.boolean().default(false),
});

export const AppDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().default(''),
  category: AppCategorySchema,
  status: AppStatusSchema,
  version: AppVersionSchema,
  stack: AppStackSchema,
  repository: AppRepositorySchema,
  dates: AppDatesSchema,
  run: AppRunSchema,
  usage: z.string().nullable().default(null),
  dependencies: AppDependenciesSchema,
  known_issues: z.array(z.string()).default([]),
  next_steps: z.array(z.string()).default([]),
  future_ideas: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  health: AppHealthSchema,
});

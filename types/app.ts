export type AppStatus = 'idea' | 'prototype' | 'mvp' | 'beta' | 'production' | 'paused' | 'abandoned';
export type AppCategory = 'personal' | 'work' | 'experiment' | 'archived';
export type VersionStrategy = 'none' | 'semver' | 'date';
export type RepoType = 'github' | 'gitlab' | 'local';

export interface AppVersion {
  current: string;
  strategy: VersionStrategy;
}

export interface AppStack {
  frontend: string | null;
  backend: string | null;
  database: string | null;
  infra: string | null;
}

export interface AppRepository {
  type: RepoType;
  url: string | null;
}

export interface AppDates {
  created: string; // YYYY-MM-DD
  last_update: string; // YYYY-MM-DD
}

export interface AppRun {
  local: string;
  docker: string | null;
}

export interface AppDependencies {
  services: string[];
  env_vars: string[];
}

export interface AppHealth {
  has_tests: boolean;
  has_ci: boolean;
  has_docker: boolean;
  has_readme: boolean;
}

export interface AppData {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  status: AppStatus;
  version: AppVersion;
  stack: AppStack;
  repository: AppRepository;
  dates: AppDates;
  run: AppRun;
  dependencies: AppDependencies;
  known_issues: string[];
  next_steps: string[];
  future_ideas: string[];
  tags: string[];
  health: AppHealth;
}

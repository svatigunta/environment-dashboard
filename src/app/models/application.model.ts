export interface Application {
  name: string;
  url: string;
  envType: 'UI' | 'Backend';
  sourceCodeUrl: string;
  jenkinsUrl: string;
  environment: Environment;
}

export type Environment = 'dev' | 'qa' | 'stage' | 'prod';

export interface EnvironmentGroup {
  environment: Environment;
  apps: Application[];
}

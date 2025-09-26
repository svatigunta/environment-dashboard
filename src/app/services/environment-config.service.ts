import { Injectable } from '@angular/core';
import { Environment } from '../models/application.model';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentConfigService {
  environmentDisplayNames: { [key in Environment]: string } = {
    dev: 'Development',
    qa: 'QA',
    stage: 'Staging',
    prod: 'Production',
  };

  environmentColors: { [key in Environment]: { textColor: string; borderColor: string } } = {
    dev: {
      textColor: 'text-blue-500 dark:text-blue-400',
      borderColor: 'border-blue-500 dark:border-blue-400',
    },
    qa: {
      textColor: 'text-orange-500 dark:text-orange-400',
      borderColor: 'border-orange-500 dark:border-orange-400',
    },
    stage: {
      textColor: 'text-purple-500 dark:text-purple-400',
      borderColor: 'border-purple-500 dark:border-purple-400',
    },
    prod: {
      textColor: 'text-red-500 dark:text-red-400',
      borderColor: 'border-red-500 dark:border-red-400',
    },
  };

  getAvailableEnvironments(): Environment[] {
    return Object.keys(this.environmentDisplayNames) as Environment[];
  }

  getEnvironmentDisplayName(environment: Environment): string {
    return this.environmentDisplayNames[environment];
  }

  getEnvironmentColors(environment: Environment) {
    return this.environmentColors[environment];
  }
}

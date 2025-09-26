import { Injectable, signal } from '@angular/core';
import { Application, Environment } from '../models/application.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationDataService {
  private applications = signal<Application[]>([
    {
      name: 'Phoenix UI',
      url: 'https://phoenix.example.dev',
      envType: 'UI',
      sourceCodeUrl: '#',
      jenkinsUrl: '#',
      environment: 'dev',
    },
    {
      name: 'Auth Service',
      url: 'https://auth-api.example.dev',
      envType: 'Backend',
      sourceCodeUrl: '#',
      jenkinsUrl: '#',
      environment: 'dev',
    },
    {
      name: 'User Profile UI',
      url: 'https://profile.example.qa',
      envType: 'UI',
      sourceCodeUrl: '#',
      jenkinsUrl: '#',
      environment: 'qa',
    },
    {
      name: 'Search API',
      url: 'https://search-api.example.qa',
      envType: 'Backend',
      sourceCodeUrl: '#',
      jenkinsUrl: '#',
      environment: 'qa',
    },
    {
      name: 'Admin Portal',
      url: 'https://admin.example.stage',
      envType: 'UI',
      sourceCodeUrl: '#',
      jenkinsUrl: '#',
      environment: 'stage',
    },
    {
      name: 'Notification Service',
      url: 'https://notifications.example.stage',
      envType: 'Backend',
      sourceCodeUrl: '#',
      jenkinsUrl: '#',
      environment: 'stage',
    },
    {
      name: 'Checkout UI',
      url: 'https://checkout.example.prod',
      envType: 'UI',
      sourceCodeUrl: '#',
      jenkinsUrl: '#',
      environment: 'prod',
    },
    {
      name: 'Payments API',
      url: 'https://payments.example.prod',
      envType: 'Backend',
      sourceCodeUrl: '#',
      jenkinsUrl: '#',
      environment: 'prod',
    },
  ]);

  getApplications() {
    return this.applications.asReadonly();
  }

  getApplicationsByEnvironment(environment: Environment) {
    return this.applications().filter(app => app.environment === environment);
  }

  searchApplications(environment: Environment, searchTerm: string) {
    const apps = this.getApplicationsByEnvironment(environment);
    if (!searchTerm) return apps;

    return apps.filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }
}

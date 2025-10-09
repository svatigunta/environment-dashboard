import { bootstrapApplication } from '@angular/platform-browser';
import SplunkRum from '@splunk/otel-web';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

// Initialize Splunk RUM
SplunkRum.init({
  realm: environment.splunkRum.realm,
  rumAccessToken: environment.splunkRum.rumAccessToken,
  applicationName: environment.splunkRum.applicationName,
  version: environment.splunkRum.version,
  deploymentEnvironment: environment.splunkRum.deploymentEnvironment,
  debug: environment.splunkRum.debug,
});

bootstrapApplication(App, appConfig).catch((err: unknown) => console.error(err));

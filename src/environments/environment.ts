// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.

export const environment = {
  production: false,
  splunkRum: {
    realm: 'us0', // Replace with your Splunk realm (e.g., 'us0', 'us1', 'eu0', 'ap0', etc.)
    rumAccessToken: 'YOUR_RUM_ACCESS_TOKEN', // Replace with your RUM access token from Splunk Observability Cloud
    applicationName: 'environment-dashboard',
    version: '1.0.0',
    deploymentEnvironment: 'development',
    debug: true, // Enable debugging in development
  },
};

// Example environment configuration file
// Copy this file and rename to environment.local.ts for local development
// Add environment.local.ts to .gitignore to keep your tokens secure

export const environment = {
  production: false,
  splunkRum: {
    // Your Splunk realm (us0, us1, eu0, ap0, jp0, etc.)
    // Find this in your Splunk Observability Cloud URL
    realm: 'us0',

    // Your RUM access token from Splunk Observability Cloud
    // Get this from Settings → Access Tokens
    rumAccessToken: 'YOUR_RUM_ACCESS_TOKEN_HERE',

    // Application name that will appear in Splunk
    applicationName: 'environment-dashboard',

    // Version number for tracking releases
    version: '1.0.0',

    // Environment name (development, staging, production, etc.)
    deploymentEnvironment: 'development',

    // Enable debug mode to see RUM logs in console
    debug: true,
  },
};

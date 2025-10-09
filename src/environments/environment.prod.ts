export const environment = {
  production: true,
  splunkRum: {
    realm: 'us0', // Replace with your Splunk realm
    rumAccessToken: 'YOUR_RUM_ACCESS_TOKEN', // Replace with your production RUM access token
    applicationName: 'environment-dashboard',
    version: '1.0.0',
    deploymentEnvironment: 'production',
    debug: false, // Disable debugging in production
  },
};

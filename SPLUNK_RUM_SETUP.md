# Splunk RUM Setup Guide

This project has been configured with Splunk Real User Monitoring (RUM) to collect performance and error data from end users.

## Prerequisites

Before you can use Splunk RUM, you need:

1. A Splunk Observability Cloud account
2. A RUM Access Token from your Splunk account
3. Your Splunk realm information

## Getting Your RUM Access Token

1. Log in to your Splunk Observability Cloud account
2. Navigate to **Settings** → **Access Tokens**
3. Create a new token with **RUM** permissions, or use an existing RUM token
4. Copy the token value

## Configuration

### Development Environment

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  splunkRum: {
    realm: 'us0', // Your Splunk realm (us0, us1, eu0, ap0, jp0, etc.)
    rumAccessToken: 'YOUR_DEV_RUM_ACCESS_TOKEN',
    applicationName: 'environment-dashboard',
    version: '1.0.0',
    deploymentEnvironment: 'development',
    debug: true,
  },
};
```

### Production Environment

Edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  splunkRum: {
    realm: 'us0', // Your Splunk realm
    rumAccessToken: 'YOUR_PROD_RUM_ACCESS_TOKEN',
    applicationName: 'environment-dashboard',
    version: '1.0.0',
    deploymentEnvironment: 'production',
    debug: false,
  },
};
```

## Available Realms

Common Splunk realms include:

- `us0` - US East (default)
- `us1` - US West
- `eu0` - Europe
- `ap0` - Asia Pacific
- `jp0` - Japan

Check your Splunk Observability Cloud URL to determine your realm (e.g., `https://app.us0.signalfx.com/`).

## What Data is Collected

Splunk RUM automatically collects:

- **Page Load Performance**: Time to first byte, DOM load time, window load time
- **XHR and Fetch Requests**: API call performance and errors
- **User Interactions**: Click events, form submissions
- **JavaScript Errors**: Unhandled exceptions and console errors
- **Resource Timing**: CSS, JavaScript, image load times
- **Web Vitals**: LCP, FID, CLS metrics

## Advanced Configuration

You can customize the RUM configuration in `src/main.ts`. Available options include:

```typescript
SplunkRum.init({
  realm: environment.splunkRum.realm,
  rumAccessToken: environment.splunkRum.rumAccessToken,
  applicationName: environment.splunkRum.applicationName,
  version: environment.splunkRum.version,
  deploymentEnvironment: environment.splunkRum.deploymentEnvironment,
  debug: environment.splunkRum.debug,

  // Optional: Ignore specific URLs from tracking
  ignoreUrls: [/localhost:4200/, /analytics.example.com/],

  // Optional: Allow insecure beacon (not recommended for production)
  allowInsecureBeacon: false,

  // Optional: Custom beacon endpoint
  beaconEndpoint: 'https://rum-ingest.us0.signalfx.com/v1/rum',

  // Optional: Configure context propagation
  context: {
    async: true,
  },

  // Optional: Configure exporter
  exporter: {
    onAttributesSerializing: attributes => {
      // Modify or filter attributes before sending
      return attributes;
    },
  },
});
```

## Custom Events and Traces

You can manually track custom events and user actions:

```typescript
import SplunkRum from '@splunk/otel-web';

// Add custom attributes to the current span
SplunkRum.setGlobalAttributes({
  userId: 'user123',
  customerTier: 'premium',
});

// Track custom events
SplunkRum.track('custom.event', {
  attribute1: 'value1',
  attribute2: 'value2',
});
```

## Running the Application

### Development Mode

```bash
npm start
# or
ng serve
```

The app will use the development environment configuration with debug mode enabled.

### Production Build

```bash
npm run build
# or
ng build --configuration=production
```

The production build will use the production environment configuration with optimizations enabled.

## Viewing Data in Splunk

1. Log in to Splunk Observability Cloud
2. Navigate to **RUM** → **Applications**
3. Select **environment-dashboard** from the list
4. View performance metrics, errors, and user sessions

## Troubleshooting

### RUM Not Sending Data

1. **Check Console**: Enable `debug: true` in your environment configuration
2. **Verify Token**: Ensure your RUM access token is correct
3. **Check Realm**: Verify you're using the correct realm
4. **CORS Issues**: Ensure your domain is allowed in Splunk settings
5. **Ad Blockers**: Ad blockers may prevent RUM data from being sent

### Common Issues

- **"Invalid token" error**: Your RUM access token may be incorrect or expired
- **No data appearing**: Check that you're looking at the correct environment and time range in Splunk
- **CORS errors**: Add your domain to the allowed origins in your Splunk RUM configuration

## Security Best Practices

1. **Never commit tokens to version control**: Use environment variables or secret management
2. **Use different tokens for different environments**: Development and production should have separate tokens
3. **Rotate tokens regularly**: Update tokens periodically for security
4. **Limit token permissions**: Use tokens with only RUM permissions

## Additional Resources

- [Splunk RUM Documentation](https://docs.splunk.com/Observability/rum/intro-to-rum.html)
- [OpenTelemetry Web SDK](https://github.com/open-telemetry/opentelemetry-js)
- [@splunk/otel-web Package](https://www.npmjs.com/package/@splunk/otel-web)

## Support

For issues related to Splunk RUM integration, please contact your Splunk support representative or visit the [Splunk Community](https://community.splunk.com/).

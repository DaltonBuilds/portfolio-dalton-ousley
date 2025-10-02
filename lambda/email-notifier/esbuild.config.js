/**
 * esbuild Configuration for Email Notifier Lambda
 * 
 * Bundles TypeScript code into a single JavaScript file optimized for Lambda
 */

const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile: 'dist/index.js',
  sourcemap: true,
  minify: true,
  external: [
    // AWS SDK v3 is available in Lambda runtime
    '@aws-sdk/*'
  ],
  logLevel: 'info',
}).catch(() => process.exit(1));


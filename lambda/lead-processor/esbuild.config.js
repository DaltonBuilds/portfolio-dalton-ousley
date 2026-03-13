/**
 * esbuild Configuration for Lambda Function
 * 
 * Bundles TypeScript code into a single JavaScript file optimized for Lambda
 */

import esbuild from 'esbuild';

const sharedConfig = {
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  sourcemap: true,
  minify: true,
  external: [
    // AWS SDK v3 is available in Lambda runtime
    '@aws-sdk/*'
  ],
  logLevel: 'info',
};

// Build main handler
await esbuild.build({
  ...sharedConfig,
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
}).catch((error) => {
  console.error('Build failed for index.ts:', error);
  process.exit(1);
});


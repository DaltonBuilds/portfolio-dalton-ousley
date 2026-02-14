'use client';

import { useEffect } from 'react';
import { onCLS, onLCP, onFCP, onTTFB, onINP, type Metric } from 'web-vitals';

/**
 * WebVitals component tracks Core Web Vitals and other performance metrics.
 * 
 * In development: Logs metrics to console
 * In production: Sends metrics to analytics endpoint (if configured)
 * 
 * Tracked metrics:
 * - LCP (Largest Contentful Paint): Should be < 2.5s
 * - INP (Interaction to Next Paint): Should be < 200ms (replaces FID)
 * - CLS (Cumulative Layout Shift): Should be < 0.1
 * - FCP (First Contentful Paint): Should be < 1.8s
 * - TTFB (Time to First Byte): Should be < 800ms
 * 
 * Note: FID (First Input Delay) has been deprecated in favor of INP
 */
export function WebVitals() {
  useEffect(() => {
    const isDevelopment = process.env.NODE_ENV === 'development';

    function handleMetric(metric: Metric) {
      // Log to console in development
      if (isDevelopment) {
        console.log(`[Web Vitals] ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        });
      }

      // Send to analytics in production
      if (!isDevelopment && typeof window !== 'undefined') {
        // Send to analytics endpoint if configured
        const analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
        
        if (analyticsEndpoint) {
          // Use sendBeacon for reliability (doesn't block page unload)
          const body = JSON.stringify({
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          });

          // Use sendBeacon if available, fallback to fetch
          if (navigator.sendBeacon) {
            navigator.sendBeacon(analyticsEndpoint, body);
          } else {
            fetch(analyticsEndpoint, {
              method: 'POST',
              body,
              headers: { 'Content-Type': 'application/json' },
              keepalive: true,
            }).catch((error) => {
              console.error('Failed to send Web Vitals metric:', error);
            });
          }
        }
      }
    }

    // Register metric handlers
    onCLS(handleMetric);
    onLCP(handleMetric);
    onFCP(handleMetric);
    onTTFB(handleMetric);
    onINP(handleMetric);
  }, []);

  // This component doesn't render anything
  return null;
}

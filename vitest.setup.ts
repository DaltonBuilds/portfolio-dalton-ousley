import '@testing-library/jest-dom'
import * as matchers from 'vitest-axe/matchers'
import { expect } from 'vitest'

// Extend Vitest's expect with axe matchers
expect.extend(matchers)

// Configure axe for vitest with global options
// Note: axe configuration is applied per-test rather than globally

// Mock IntersectionObserver for framer-motion
globalThis.IntersectionObserver = class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds = []

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    void callback
    void options
  }
  disconnect() {}
  observe(target: Element) {
    void target
  }
  takeRecords() {
    return [] as IntersectionObserverEntry[]
  }
  unobserve(target: Element) {
    void target
  }
}

// Mock HTMLCanvasElement for mermaid diagrams
if (typeof HTMLCanvasElement !== 'undefined') {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: (contextId: string) => {
      void contextId
      return ({
        fillRect: () => {},
        clearRect: () => {},
        getImageData: () => ({ data: new Uint8ClampedArray(4) }),
        putImageData: () => {},
        createImageData: () => ({ data: new Uint8ClampedArray(4) }),
        setTransform: () => {},
        drawImage: () => {},
        save: () => {},
        fillText: () => {},
        restore: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        stroke: () => {},
        translate: () => {},
        scale: () => {},
        rotate: () => {},
        arc: () => {},
        fill: () => {},
        measureText: () => ({ width: 0 }),
        transform: () => {},
        rect: () => {},
        clip: () => {},
      }) as unknown as CanvasRenderingContext2D
    },
  })
}

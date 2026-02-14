import '@testing-library/jest-dom'
import * as matchers from 'vitest-axe/matchers'
import { expect } from 'vitest'
import { configureAxe } from 'vitest-axe'

// Extend Vitest's expect with axe matchers
expect.extend(matchers)

// Configure axe for vitest with global options
// Note: axe configuration is applied per-test rather than globally

// Mock IntersectionObserver for framer-motion
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any

// Mock HTMLCanvasElement for mermaid diagrams
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function () {
    return {
      fillRect: function () {},
      clearRect: function () {},
      getImageData: function () {
        return {
          data: new Array(4),
        }
      },
      putImageData: function () {},
      createImageData: function () {
        return []
      },
      setTransform: function () {},
      drawImage: function () {},
      save: function () {},
      fillText: function () {},
      restore: function () {},
      beginPath: function () {},
      moveTo: function () {},
      lineTo: function () {},
      closePath: function () {},
      stroke: function () {},
      translate: function () {},
      scale: function () {},
      rotate: function () {},
      arc: function () {},
      fill: function () {},
      measureText: function () {
        return { width: 0 }
      },
      transform: function () {},
      rect: function () {},
      clip: function () {},
    } as any
  } as any
}

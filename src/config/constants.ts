// Animation constants
export const ANIMATION_DURATION = 300
export const TRANSITION_EASE = 'ease-in-out'

// Layout constants
export const HEADER_HEIGHT = '4rem'
export const MAX_CONTENT_WIDTH = '1200px'
export const MOBILE_BREAKPOINT = '768px'

// Blog constants
export const POSTS_PER_PAGE = 9
export const FEATURED_POSTS_LIMIT = 3

// Skills categories
export const SKILL_CATEGORIES = {
  DEVOPS: 'DevOps',
  CLOUD: 'Cloud',
  INFRASTRUCTURE: 'Infrastructure',
  AUTOMATION: 'Automation',
  DEVELOPMENT: 'Development',
} as const

// File paths
export const PATHS = {
  BLOG_IMAGES: '/blog/images',
  PROFILE_IMAGE: '/Dalton-Ousley-portrait-white-buttondown.avif',
  FAVICON: '/dalton-ousley-favicon.svg',
  /** Resume PDF served when users download resume from the site */
  RESUME: '/Dalton_Ousley_Resume_v1.0.0.pdf',
} as const

// Date formats
export const DATE_FORMATS = {
  BLOG_POST: 'MMMM dd, yyyy',
  ISO: 'yyyy-MM-dd',
} as const

// SEO defaults
export const SEO_DEFAULTS = {
  titleTemplate: '%s | Dalton Ousley',
  defaultTitle: 'Dalton Ousley - DevOps Engineer & Cloud Architect',
  defaultDescription: 'DevOps Engineer and Cloud Architect specializing in Kubernetes, cloud infrastructure, and automation.',
} as const


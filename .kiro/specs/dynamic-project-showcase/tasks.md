# Implementation Plan: Dynamic Project Showcase System

## Overview

This implementation plan transforms the `/projects` page from hardcoded project cards to a dynamic system powered by Velite-processed blog posts. The approach extends the existing Velite schema with optional project fields, creates utility functions for filtering and grouping, builds reusable React components, and implements comprehensive testing with both unit and property-based tests.

## Tasks

- [x] 1. Extend Velite schema with project-specific fields
  - Modify `velite.config.ts` to add optional project fields: `projectCategory`, `projectStatus`, `techStack`, `projectUrl`, `githubUrl`
  - Add enum validation for `projectStatus` field (Completed, In Progress, Not Started)
  - Add URL validation for `projectUrl` and `githubUrl` fields
  - Ensure existing blog post fields and transformations remain unchanged
  - Run Velite build to verify schema changes work correctly
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

- [ ]* 1.1 Write property tests for schema validation
  - **Property 1: Schema validates project-specific fields correctly**
  - **Property 2: Schema accepts valid URLs for project links**
  - **Property 3: Optional project fields use defaults gracefully**
  - **Property 4: Schema preserves existing blog functionality**
  - **Validates: Requirements 1.1-1.8**

- [x] 2. Create TypeScript types and interfaces
  - Create `types/project.ts` with `ProjectStatus` type and `ProjectPost` interface
  - Create `ProjectFilters` interface for filter state
  - Create `GroupedProjects` interface for categorized projects
  - Export type guard function `isProjectPost` to identify project posts
  - _Requirements: 8.3_

- [ ]* 2.1 Write property test for type guard
  - **Property 24: Type guard correctly identifies project posts**
  - **Validates: Requirements 8.3**

- [x] 3. Implement project utility functions
  - [x] 3.1 Create `lib/projects.ts` with core utility functions
    - Implement `getProjectPosts()` to filter and sort project posts
    - Implement `groupProjectsByCategory()` to organize projects by category
    - Implement `getAllTechnologies()` to extract unique tech tags
    - Implement `filterProjects()` to apply user-selected filters
    - Implement `getProjectCountsByStatus()` to count projects by status
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.3, 5.5, 6.1, 9.3_

  - [ ]* 3.2 Write property tests for filtering and grouping
    - **Property 5: Project post filtering by category**
    - **Property 6: Incomplete project posts included with defaults**
    - **Property 12: Projects group by category correctly**
    - **Property 15: Status and technology filters work correctly**
    - **Property 16: Multiple technology filters use OR logic**
    - **Property 18: Project counts by status are accurate**
    - **Property 19: Technology extraction produces unique values**
    - **Property 27: Utility functions perform correct operations**
    - **Validates: Requirements 2.1-2.4, 4.1, 4.3, 5.2, 5.5, 6.1, 6.3, 6.4, 6.5, 9.3**

  - [ ]* 3.3 Write unit tests for utility functions
    - Test edge cases: empty arrays, missing fields, null values
    - Test specific examples with known expected outputs
    - Test error conditions and boundary values
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 5.5, 6.1_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Build core UI components
  - [x] 5.1 Create StatusBadge component
    - Implement `components/projects/StatusBadge.tsx`
    - Add status-specific styling (green for Completed, blue for In Progress, gray for Not Started)
    - Support dark mode variants
    - _Requirements: 3.6_

  - [ ]* 5.2 Write property test for StatusBadge
    - **Property 9: Status badges have correct styling**
    - **Validates: Requirements 3.6**

  - [x] 5.3 Create TechStackTags component
    - Implement `components/projects/TechStackTags.tsx`
    - Render array of technology tags with consistent styling
    - Support optional `maxDisplay` prop to limit visible tags
    - _Requirements: 3.7_

  - [ ]* 5.4 Write property test for TechStackTags
    - **Property 10: Tech stack tags render completely**
    - **Validates: Requirements 3.7**

  - [x] 5.5 Create ProjectCard component
    - Implement `components/projects/ProjectCard.tsx`
    - Render project title, description, status badge, category, and date
    - Conditionally render image if present
    - Conditionally render "View Project" link if projectUrl exists
    - Conditionally render "View Code" link if githubUrl exists
    - Render tech stack tags
    - Make entire card clickable to navigate to blog post permalink
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.7, 3.8_

  - [ ]* 5.6 Write property tests for ProjectCard
    - **Property 7: Project cards render all required fields**
    - **Property 8: Conditional fields render when present**
    - **Property 11: Project card navigation**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5, 3.8**

  - [ ]* 5.7 Write unit tests for ProjectCard
    - Test rendering with complete project data
    - Test rendering with minimal project data (missing optional fields)
    - Test click behavior and navigation
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.8_

- [x] 6. Build filtering and layout components
  - [x] 6.1 Create ProjectFilters component
    - Implement `components/projects/ProjectFilters.tsx`
    - Add status filter dropdown with project counts
    - Add technology filter multi-select with available technologies
    - Add category filter dropdown
    - Emit filter changes via `onFilterChange` callback
    - Display active filter count
    - Add "Clear filters" button
    - _Requirements: 5.1, 5.4, 5.5, 6.2_

  - [ ]* 6.2 Write property test for filter state
    - **Property 17: Filter state persistence**
    - **Validates: Requirements 5.4**

  - [ ]* 6.3 Write unit tests for ProjectFilters
    - Test filter UI rendering
    - Test filter change callbacks
    - Test clear filters functionality
    - _Requirements: 5.1, 5.4, 5.5, 6.2_

  - [x] 6.4 Create ProjectGrid component
    - Implement `components/projects/ProjectGrid.tsx`
    - Accept array of projects and render in responsive grid layout
    - Support optional `groupByCategory` prop for grouped display
    - Render category headings when grouping is enabled
    - Only display categories that have projects
    - Handle empty state with helpful message
    - _Requirements: 4.1, 4.2, 4.4, 4.5_

  - [ ]* 6.5 Write property tests for ProjectGrid
    - **Property 13: Category headings render for non-empty groups**
    - **Property 14: Category ordering is deterministic**
    - **Validates: Requirements 4.2, 4.4, 4.5**

  - [ ]* 6.6 Write unit tests for ProjectGrid
    - Test grid rendering with projects
    - Test grouped rendering with category headings
    - Test empty state rendering
    - _Requirements: 4.1, 4.2, 4.5_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement dynamic Projects page
  - [x] 8.1 Create new Projects page component
    - Implement `src/app/projects/page.tsx`
    - Import all processed posts from Velite
    - Use `getProjectPosts()` to filter for project posts
    - Implement client-side filter state management
    - Render ProjectFilters component with filter state
    - Apply filters using `filterProjects()` utility
    - Render ProjectGrid with filtered projects
    - Add page metadata for SEO
    - _Requirements: 3.1, 5.1, 5.2, 5.3, 6.2, 6.3_

  - [ ]* 8.2 Write integration tests for Projects page
    - Test page renders with project data
    - Test filtering updates displayed projects
    - Test empty state when no projects match filters
    - _Requirements: 3.1, 5.2, 5.3, 6.3_

- [x] 9. Enhance blog post pages with project metadata
  - [x] 9.1 Update blog post template to display project metadata
    - Modify blog post page component to detect project posts
    - Conditionally render project metadata section (status, category, tech stack)
    - Add "View Project" and "View Code" buttons if URLs exist
    - Ensure project metadata appears prominently near post header
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 9.2 Write property tests for blog integration
    - **Property 20: Project posts function as blog posts**
    - **Property 21: Project metadata appears on blog pages**
    - **Property 22: Project posts generate correct meta tags**
    - **Property 23: Project posts appear in blog index**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

  - [ ]* 9.3 Write unit tests for blog post enhancements
    - Test project metadata rendering on blog post pages
    - Test non-project posts don't show project metadata
    - Test meta tag generation for project posts
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 10. Add extensibility features
  - [x] 10.1 Implement pagination support in utility functions
    - Add optional pagination parameters to `getProjectPosts()` (page, pageSize)
    - Return paginated results and total count
    - _Requirements: 9.2_

  - [ ]* 10.2 Write property test for pagination
    - **Property 26: Query functions support pagination parameters**
    - **Validates: Requirements 9.2**

  - [x] 10.3 Add series support for project posts
    - Verify series and seriesOrder fields work with project posts
    - Add utility function to group projects by series
    - _Requirements: 9.1_

  - [ ]* 10.4 Write property test for series support
    - **Property 25: Series fields work for project posts**
    - **Validates: Requirements 9.1**

- [x] 11. Update existing project blog posts with new metadata
  - Add project-specific frontmatter to existing project posts
  - Add `projectCategory` field (e.g., "Cloud Engineering", "DevOps", "Full-Stack")
  - Add `projectStatus` field (Completed, In Progress, Not Started)
  - Add `techStack` array with technologies used
  - Add `projectUrl` and `githubUrl` where applicable
  - Verify all posts build successfully with new schema
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 12. Remove hardcoded project cards from old Projects page
  - Delete or comment out hardcoded ProjectCard components
  - Verify new dynamic system displays all projects correctly
  - Check that no projects are missing from the new implementation
  - _Requirements: 3.1_

- [ ] 13. Final checkpoint - Ensure all tests pass and system works end-to-end
  - Run full test suite (unit tests and property tests)
  - Build the site and verify no Velite errors
  - Manually test Projects page filtering and navigation
  - Verify project posts appear correctly on blog index
  - Verify project metadata displays on individual blog post pages
  - Test responsive layouts on mobile and desktop
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- The implementation maintains backward compatibility with existing blog infrastructure
- All project data comes from blog posts—no separate data source needed

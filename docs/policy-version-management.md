# Policy Version Management System

## Overview

This document describes the policy version management system for Privacy Policy and Terms of Use documents on daltonousley.dev. The system tracks version history, maintains effective date ranges, and provides transparency to users about policy changes.

## Architecture

### Core Components

1. **Version Tracking Module** (`src/lib/policy-versions.ts`)
   - Stores version history for both policies
   - Provides utility functions for version management
   - Maintains current version and historical versions

2. **Policy Pages** (`src/app/privacy/page.tsx`, `src/app/terms/page.tsx`)
   - Display current policy content
   - Show version number and last updated date
   - Link to version history when multiple versions exist

3. **Version History Pages** (`src/app/privacy/history/page.tsx`, `src/app/terms/history/page.tsx`)
   - Display all versions chronologically
   - Show effective date ranges
   - List changes made in each version

## Data Structure

### PolicyVersion Interface

```typescript
interface PolicyVersion {
  version: string;           // Semantic version (e.g., "1.0.0")
  effectiveDate: Date;       // When this version became effective
  endDate?: Date;            // When this version was superseded (undefined for current)
  lastUpdated: string;       // Display format: "February 13, 2026"
  changes?: string[];        // List of changes made in this version
}
```

### PolicyVersionHistory Interface

```typescript
interface PolicyVersionHistory {
  policyType: 'privacy' | 'terms';
  currentVersion: string;
  versions: PolicyVersion[];
}
```

## Usage

### Viewing Current Version

The current version is automatically displayed on policy pages:

```typescript
import { getCurrentVersion } from '@/lib/policy-versions';

const currentVersion = getCurrentVersion('privacy');
console.log(currentVersion.version);      // "1.0.0"
console.log(currentVersion.lastUpdated);  // "February 13, 2026"
```

### Adding a New Version

When updating policy content, add a new version:

```typescript
import { addNewVersion } from '@/lib/policy-versions';

addNewVersion('privacy', {
  version: '1.1.0',
  lastUpdated: 'March 15, 2026',
  effectiveDate: new Date('2026-03-15'),
  changes: [
    'Added new third-party service disclosure',
    'Updated data retention period',
  ],
});
```

The system automatically:
- Sets the end date for the previous version
- Makes the new version current
- Enables the version history link on the policy page

### Checking Version History

```typescript
import { hasVersionHistory, getAllVersions } from '@/lib/policy-versions';

// Check if policy has multiple versions
if (hasVersionHistory('privacy')) {
  // Get all versions sorted by date (newest first)
  const versions = getAllVersions('privacy');
}
```

### Getting Version at Specific Date

```typescript
import { getVersionAtDate } from '@/lib/policy-versions';

const date = new Date('2026-02-15');
const version = getVersionAtDate('privacy', date);
```

## Version Numbering

We use semantic versioning (MAJOR.MINOR.PATCH):

- **Major version (X.0.0)**: Significant changes affecting user rights or obligations
  - Example: New data collection practices, reduced user rights
  
- **Minor version (1.X.0)**: New sections, additional disclosures, or policy expansions
  - Example: Adding new third-party service, expanding cookie policy
  
- **Patch version (1.0.X)**: Typo fixes, clarifications, or formatting changes
  - Example: Correcting typos, reformatting sections

## Material vs Non-Material Changes

### Material Changes (Require User Notification)

Material changes significantly affect user rights or data handling:

- New data collection practices
- New third-party data sharing
- Reduced user rights
- Changes to data retention period
- Changes to governing law or jurisdiction
- New cookie usage requiring consent

**Notification Process:**
1. Add new version with effective date 30 days in future
2. Send email notification to all users with contact information
3. Display prominent notice on website
4. Update policy page with new version on effective date

### Non-Material Changes (No Notification Required)

Minor changes that don't affect user rights:

- Typo corrections
- Formatting improvements
- Clarifications that don't change meaning
- Updated contact information
- Reorganization of sections without content changes

**Process:**
1. Add new version with immediate effective date
2. Update policy page
3. No user notification required

## Compliance Requirements

### GDPR Requirements (Requirements 10.1, 10.2)

1. **Version Date Updates**: When policy content changes, the "Last Updated" date must be updated
2. **Version History**: Maintain a record of previous versions with effective date ranges
3. **Transparency**: Users must be able to view version history
4. **Material Change Notification**: Users must be notified of material changes

### CCPA Requirements

1. **Notice of Changes**: Provide notice of material changes to privacy practices
2. **Effective Date**: Clearly display when changes take effect
3. **Access to Previous Versions**: Allow users to review previous policy versions

## Implementation Checklist

When updating a policy:

- [ ] Update policy content in the page component
- [ ] Add new version entry using `addNewVersion()`
- [ ] Document changes in the `changes` array
- [ ] Set appropriate effective date
- [ ] Determine if changes are material
- [ ] If material: Send user notifications, display website notice
- [ ] Test version history page displays correctly
- [ ] Verify current version shows on policy page
- [ ] Update this documentation if process changes

## Testing

### Manual Testing

1. **Current Version Display**
   - Navigate to /privacy and /terms
   - Verify version number and last updated date are displayed
   - Verify version matches current version in policy-versions.ts

2. **Version History**
   - Add a second version to test history
   - Verify "View version history" link appears
   - Navigate to /privacy/history or /terms/history
   - Verify all versions are listed chronologically
   - Verify current version is marked
   - Verify effective dates and changes are displayed

3. **Version Transitions**
   - Add a new version
   - Verify previous version gets end date
   - Verify new version becomes current
   - Verify version history shows both versions

### Automated Testing

See `src/lib/__tests__/policy-versions.test.ts` for unit tests covering:
- Getting current version
- Adding new versions
- Version history retrieval
- Date-based version lookup

## Future Enhancements

Potential improvements to consider:

1. **Automated Notifications**: Email service integration for automatic user notifications
2. **Diff View**: Show side-by-side comparison of policy versions
3. **Version Archive**: Store full policy content for each version (not just changes)
4. **Admin Interface**: Web UI for managing policy versions
5. **Audit Log**: Track who made changes and when
6. **Scheduled Updates**: Set future effective dates with automatic activation

## References

- Requirements: `.kiro/specs/legal-compliance-pages/requirements.md` (Requirements 10.1, 10.2)
- Design: `.kiro/specs/legal-compliance-pages/design.md`
- Implementation: `.kiro/specs/legal-compliance-pages/tasks.md` (Task 12)

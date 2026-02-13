/**
 * Example: How to add a new policy version
 * 
 * This file demonstrates how to update policy versions when making changes
 * to the Privacy Policy or Terms of Use.
 */

import { addNewVersion } from '../policy-versions';

/**
 * Example 1: Adding a new Privacy Policy version
 * 
 * When you update the Privacy Policy content, you should:
 * 1. Update the policy content in src/app/privacy/page.tsx
 * 2. Add a new version entry using addNewVersion()
 * 3. The system will automatically:
 *    - Set the end date for the previous version
 *    - Make the new version current
 *    - Display version history link on the policy page
 */
function exampleAddPrivacyPolicyVersion() {
  addNewVersion('privacy', {
    version: '1.1.0',
    lastUpdated: 'March 15, 2026',
    effectiveDate: new Date('2026-03-15'),
    changes: [
      'Added new third-party service disclosure (Google Analytics)',
      'Updated data retention period from 18 to 24 months',
      'Added cookie consent banner requirement',
    ],
  });
}

/**
 * Example 2: Adding a new Terms of Use version
 */
function exampleAddTermsOfUseVersion() {
  addNewVersion('terms', {
    version: '1.1.0',
    lastUpdated: 'March 15, 2026',
    effectiveDate: new Date('2026-03-15'),
    changes: [
      'Updated acceptable use policy to include AI-generated content restrictions',
      'Added arbitration clause for dispute resolution',
      'Updated governing law from Texas to Delaware',
    ],
  });
}

/**
 * Example 3: Minor update (patch version)
 * 
 * For minor corrections or clarifications that don't materially change the policy
 */
function exampleMinorUpdate() {
  addNewVersion('privacy', {
    version: '1.0.1',
    lastUpdated: 'February 20, 2026',
    effectiveDate: new Date('2026-02-20'),
    changes: [
      'Fixed typo in GDPR section',
      'Clarified data retention calculation method',
      'Updated contact email format',
    ],
  });
}

/**
 * Best Practices for Version Management:
 * 
 * 1. Version Numbering:
 *    - Major version (X.0.0): Significant changes affecting user rights or obligations
 *    - Minor version (1.X.0): New sections, additional disclosures, or policy expansions
 *    - Patch version (1.0.X): Typo fixes, clarifications, or formatting changes
 * 
 * 2. Effective Dates:
 *    - Set effective date to when the new policy takes effect
 *    - For material changes, give users 30 days notice before effective date
 *    - The system automatically sets end date for previous version
 * 
 * 3. Change Documentation:
 *    - Always document what changed in the 'changes' array
 *    - Be specific and user-friendly in change descriptions
 *    - Material changes should be clearly marked
 * 
 * 4. User Notification:
 *    - Material changes require email notification to users
 *    - Display prominent notice on website for 30 days
 *    - Update "Last Updated" date on policy page
 * 
 * 5. Material vs Non-Material Changes:
 *    Material changes (require notification):
 *    - New data collection practices
 *    - New third-party data sharing
 *    - Reduced user rights
 *    - Changes to data retention period
 *    - Changes to governing law or jurisdiction
 * 
 *    Non-material changes (no notification required):
 *    - Typo corrections
 *    - Formatting improvements
 *    - Clarifications that don't change meaning
 *    - Updated contact information
 */

// Export examples for documentation purposes
export {
  exampleAddPrivacyPolicyVersion,
  exampleAddTermsOfUseVersion,
  exampleMinorUpdate,
};

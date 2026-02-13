/**
 * Policy Version Management System
 * 
 * This module provides version tracking for Privacy Policy and Terms of Use documents.
 * It maintains a history of policy changes with effective date ranges.
 */

export interface PolicyVersion {
  version: string;
  effectiveDate: Date;
  endDate?: Date; // undefined for current version
  lastUpdated: string; // Display format: "February 13, 2026"
  changes?: string[]; // Optional list of changes made in this version
}

export interface PolicyVersionHistory {
  policyType: 'privacy' | 'terms';
  currentVersion: string;
  versions: PolicyVersion[];
}

/**
 * Privacy Policy Version History
 */
export const privacyPolicyVersions: PolicyVersionHistory = {
  policyType: 'privacy',
  currentVersion: '1.0.0',
  versions: [
    {
      version: '1.0.0',
      effectiveDate: new Date('2026-02-13'),
      lastUpdated: 'February 13, 2026',
      changes: [
        'Initial Privacy Policy published',
        'GDPR compliance implemented',
        'CCPA compliance implemented',
        'Cookie policy disclosure added',
        'Data retention policy (18 months) established',
      ],
    },
  ],
};

/**
 * Terms of Use Version History
 */
export const termsOfUseVersions: PolicyVersionHistory = {
  policyType: 'terms',
  currentVersion: '1.0.0',
  versions: [
    {
      version: '1.0.0',
      effectiveDate: new Date('2026-02-13'),
      lastUpdated: 'February 13, 2026',
      changes: [
        'Initial Terms of Use published',
        'Acceptable use policy defined',
        'Liability limitations established',
        'Governing law (Texas) specified',
      ],
    },
  ],
};

/**
 * Get the current version of a policy
 */
export function getCurrentVersion(policyType: 'privacy' | 'terms'): PolicyVersion {
  const history = policyType === 'privacy' ? privacyPolicyVersions : termsOfUseVersions;
  const currentVersion = history.versions.find(v => v.version === history.currentVersion);
  
  if (!currentVersion) {
    throw new Error(`Current version ${history.currentVersion} not found for ${policyType} policy`);
  }
  
  return currentVersion;
}

/**
 * Get all versions of a policy
 */
export function getAllVersions(policyType: 'privacy' | 'terms'): PolicyVersion[] {
  const history = policyType === 'privacy' ? privacyPolicyVersions : termsOfUseVersions;
  return [...history.versions].sort((a, b) => b.effectiveDate.getTime() - a.effectiveDate.getTime());
}

/**
 * Get a specific version of a policy
 */
export function getVersion(policyType: 'privacy' | 'terms', version: string): PolicyVersion | undefined {
  const history = policyType === 'privacy' ? privacyPolicyVersions : termsOfUseVersions;
  return history.versions.find(v => v.version === version);
}

/**
 * Add a new version to policy history
 * This function should be called when updating policy content
 */
export function addNewVersion(
  policyType: 'privacy' | 'terms',
  newVersion: Omit<PolicyVersion, 'effectiveDate'> & { effectiveDate?: Date }
): void {
  const history = policyType === 'privacy' ? privacyPolicyVersions : termsOfUseVersions;
  
  // Set end date for current version
  const currentVersion = history.versions.find(v => v.version === history.currentVersion);
  if (currentVersion && !currentVersion.endDate) {
    currentVersion.endDate = newVersion.effectiveDate || new Date();
  }
  
  // Add new version
  const versionToAdd: PolicyVersion = {
    ...newVersion,
    effectiveDate: newVersion.effectiveDate || new Date(),
  };
  
  history.versions.push(versionToAdd);
  history.currentVersion = versionToAdd.version;
}

/**
 * Check if a policy has been updated (has multiple versions)
 */
export function hasVersionHistory(policyType: 'privacy' | 'terms'): boolean {
  const history = policyType === 'privacy' ? privacyPolicyVersions : termsOfUseVersions;
  return history.versions.length > 1;
}

/**
 * Get version effective at a specific date
 */
export function getVersionAtDate(policyType: 'privacy' | 'terms', date: Date): PolicyVersion | undefined {
  const versions = getAllVersions(policyType);
  
  return versions.find(v => {
    const isAfterStart = date >= v.effectiveDate;
    const isBeforeEnd = !v.endDate || date < v.endDate;
    return isAfterStart && isBeforeEnd;
  });
}

# Implementation Plan: Legal Compliance Pages

## Overview

This implementation plan breaks down the legal compliance pages feature into discrete coding tasks. The approach focuses on creating the policy pages first, then enhancing the contact form with consent mechanism, adding footer navigation, and finally implementing the privacy request handling system. Each task builds incrementally with validation through automated tests.

## Tasks

- [x] 1. Create Privacy Policy and Terms of Use page components
  - Create `/pages/privacy.tsx` (or equivalent route file) for Privacy Policy page
  - Create `/pages/terms.tsx` (or equivalent route file) for Terms of Use page
  - Implement PolicyPage component with sections for all required disclosures
  - Add "Last Updated" date display at the top of each policy page
  - Write comprehensive policy content covering all requirements (GDPR, CCPA, data collection, storage, retention, third parties, international transfers, data subject rights, security, cookies)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [ ]* 1.1 Write unit tests for policy page rendering
  - Test that /privacy route renders Privacy Policy content
  - Test that /terms route renders Terms of Use content
  - Test that last updated date is displayed on both pages
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [ ]* 1.2 Write property test for policy page date display
  - **Property 1: Policy Pages Include Last Update Date**
  - **Validates: Requirements 1.2, 2.2**

- [x] 2. Enhance contact form with consent mechanism
  - [x] 2.1 Update ContactForm component to include consent checkbox
    - Add consent checkbox UI element above submit button
    - Add label text: "I agree to the [Privacy Policy](/privacy) and [Terms of Use](/terms)"
    - Make Privacy Policy and Terms of Use clickable links
    - Add state management for consent checkbox (checked/unchecked)
    - _Requirements: 3.1, 3.2_

  - [x] 2.2 Implement consent validation logic
    - Disable submit button when consent checkbox is unchecked
    - Add validation to prevent form submission without consent
    - Display error message when submission attempted without consent
    - _Requirements: 3.3, 3.4_

  - [ ]* 2.3 Write property test for consent validation
    - **Property 2: Consent Checkbox Controls Form Submission**
    - **Validates: Requirements 3.4**

  - [x] 2.4 Update form submission handler to record consent
    - Add consentGiven boolean field to submission data
    - Add consentTimestamp field with current timestamp
    - Update DynamoDB schema to include consent fields
    - _Requirements: 3.5_

  - [ ]* 2.5 Write property test for consent timestamp recording
    - **Property 3: Consent Timestamp Recorded on Submission**
    - **Validates: Requirements 3.5**

  - [ ]* 2.6 Write unit tests for form validation
    - Test submit button disabled when consent unchecked
    - Test error message display when submitting without consent
    - Test successful submission includes consent fields
    - _Requirements: 3.3, 3.4, 3.5_

- [ ] 3. Checkpoint - Test contact form with consent mechanism
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Add footer navigation with policy links
  - [x] 4.1 Create or update Footer component
    - Add "Legal" section to footer
    - Add link to Privacy Policy (/privacy)
    - Add link to Terms of Use (/terms)
    - Style links to be visually distinct from other footer content
    - _Requirements: 4.1, 4.4_

  - [x] 4.2 Ensure footer appears on all pages
    - Add Footer component to layout or app wrapper
    - Verify footer renders on all routes
    - _Requirements: 4.2_

  - [ ]* 4.3 Write property test for footer presence
    - **Property 4: Footer Links Present on All Pages**
    - **Validates: Requirements 4.2**

  - [ ]* 4.4 Write property test for footer link navigation
    - **Property 5: Footer Link Navigation**
    - **Validates: Requirements 4.3**

  - [ ]* 4.5 Write unit tests for footer component
    - Test footer includes Privacy Policy link
    - Test footer includes Terms of Use link
    - Test links navigate to correct URLs
    - _Requirements: 4.1, 4.3_

- [-] 5. Create DynamoDB tables for privacy request handling
  - [x] 5.1 Create privacy-requests DynamoDB table
    - Define table schema with id (primary key), requestType, requesterEmail, requestedAt, processedAt, status, notes, verificationToken, ttl
    - Create GSI: email-status-index (partition: requesterEmail, sort: status)
    - Configure TTL on ttl attribute (2 years)
    - _Requirements: 5.6_

  - [-] 5.2 Update contact-submissions table schema
    - Add email GSI if not already present (partition: email)
    - Verify TTL configuration on ttl attribute
    - Add consentGiven and consentTimestamp fields to schema
    - _Requirements: 3.5, 5.2, 5.3, 5.4_

- [~] 6. Implement privacy request handler functions
  - [ ] 6.1 Implement access request handler
    - Create function to query contact-submissions by email using GSI
    - Return all matching submissions with all fields
    - Create log entry in privacy-requests table
    - _Requirements: 5.2, 5.6_

  - [ ]* 6.2 Write property test for access request
    - **Property 6: Access Request Returns All Data**
    - **Validates: Requirements 5.2**

  - [ ] 6.3 Implement deletion request handler
    - Create function to query contact-submissions by email using GSI
    - Delete all matching submissions
    - Verify deletion by querying again (should return zero results)
    - Create log entry in privacy-requests table
    - _Requirements: 5.3, 5.6_

  - [ ]* 6.4 Write property test for deletion request
    - **Property 7: Deletion Request Removes All Data**
    - **Validates: Requirements 5.3**

  - [ ] 6.5 Implement portability request handler
    - Create function to query contact-submissions by email using GSI
    - Export all matching submissions as JSON string
    - Validate JSON is parseable and contains all fields
    - Create log entry in privacy-requests table
    - _Requirements: 5.4, 5.6_

  - [ ]* 6.6 Write property test for portability export
    - **Property 8: Portability Export Produces Valid JSON**
    - **Validates: Requirements 5.4**

  - [ ]* 6.7 Write property test for privacy request logging
    - **Property 10: Privacy Requests Are Logged**
    - **Validates: Requirements 5.6**

- [ ] 7. Implement email verification for privacy requests
  - [ ] 7.1 Create verification token generation
    - Generate secure random token for each privacy request
    - Store token in privacy-requests table with 24-hour expiration
    - _Requirements: 5.5_

  - [ ] 7.2 Create verification email template
    - Design email with verification link containing token
    - Include instructions for completing verification
    - Use Resend service to send verification email
    - _Requirements: 5.5_

  - [ ] 7.3 Implement verification endpoint
    - Create API endpoint to verify token
    - Update privacy request status from 'pending' to 'verified'
    - Process verified requests (access/deletion/portability)
    - Send response email with results
    - _Requirements: 5.5_

  - [ ]* 7.4 Write property test for unverified request rejection
    - **Property 9: Unverified Requests Are Rejected**
    - **Validates: Requirements 5.5**

  - [ ]* 7.5 Write unit tests for verification flow
    - Test token generation creates unique tokens
    - Test verification email is sent
    - Test verification endpoint validates tokens
    - Test expired tokens are rejected
    - _Requirements: 5.5_

- [ ] 8. Checkpoint - Test privacy request handling system
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement TTL calculation and validation
  - [ ] 9.1 Create TTL calculation utility function
    - Calculate TTL as submission timestamp + 18 months (in seconds)
    - Handle edge cases (leap years, month boundaries)
    - _Requirements: 1.6_

  - [ ] 9.2 Update form submission handler to use TTL calculation
    - Call TTL utility when storing submissions
    - Store TTL value in DynamoDB ttl field
    - _Requirements: 1.6_

  - [ ]* 9.3 Write property test for TTL calculation accuracy
    - **Property 15: TTL Calculation Accuracy**
    - **Validates: Requirements 1.6**

  - [ ]* 9.4 Write unit tests for TTL calculation
    - Test TTL calculation for various submission dates
    - Test edge cases (end of month, leap years)
    - Verify TTL is exactly 18 months from submission
    - _Requirements: 1.6_

- [ ] 10. Implement comprehensive form validation
  - [ ] 10.1 Add validation for all form fields
    - Name: required, 1-100 characters
    - Email: required, valid email format
    - Company: optional, max 100 characters
    - Message: required, 10-5000 characters
    - Consent: required (must be true)
    - _Requirements: 3.1, 3.4_

  - [ ] 10.2 Implement validation error messages
    - Display specific error message for each invalid field
    - Show inline errors next to form fields
    - Prevent submission when validation fails
    - _Requirements: 3.4_

  - [ ]* 10.3 Write property test for form validation
    - **Property 16: Form Validation Rejects Invalid Data**
    - **Validates: Requirements 3.1, 3.4**

  - [ ]* 10.4 Write unit tests for field validation
    - Test each validation rule individually
    - Test error message display
    - Test submission prevention with invalid data
    - _Requirements: 3.1, 3.4_

- [ ] 11. Implement cookie disclosure and conditional banner
  - [ ] 11.1 Audit current cookie usage
    - Document all cookies currently set by the website
    - Categorize cookies (essential, functional, analytics, marketing)
    - Update Privacy Policy with cookie list
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ] 11.2 Implement conditional cookie banner logic
    - Check if non-essential cookies are used
    - If yes, display cookie consent banner before setting cookies
    - If no (only essential), skip banner
    - _Requirements: 8.4, 8.5_

  - [ ]* 11.3 Write property test for cookie banner display
    - **Property 12: Cookie Banner Conditional Display**
    - **Validates: Requirements 8.4, 8.5**

- [ ] 12. Implement policy version management
  - [ ] 12.1 Create policy version tracking system
    - Store policy versions with effective date ranges
    - Update "Last Updated" date when policy content changes
    - Maintain history of previous versions
    - _Requirements: 10.1, 10.2_

  - [ ]* 12.2 Write property test for policy update date
    - **Property 13: Policy Update Date Changes on Modification**
    - **Validates: Requirements 10.1**

  - [ ]* 12.3 Write property test for version history
    - **Property 14: Policy Version History Maintained**
    - **Validates: Requirements 10.2**

- [ ] 13. Final checkpoint - Integration testing and compliance review
  - Run all unit tests and property tests
  - Manually test complete user flows (form submission, privacy requests)
  - Review Privacy Policy against GDPR checklist
  - Review Privacy Policy against CCPA checklist
  - Verify all required disclosures are present and accurate
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Property tests should run minimum 100 iterations each
- Each property test must include a comment tag: `Feature: legal-compliance-pages, Property {number}: {property_text}`
- Privacy request handling (tasks 6-7) can be implemented as manual email-based process initially, then automated later
- Cookie banner (task 11) may not be needed if only essential cookies are used
- Policy content should be reviewed by legal counsel before deployment
- Consider using a legal policy generator service (e.g., Termly, iubenda) for initial policy drafts

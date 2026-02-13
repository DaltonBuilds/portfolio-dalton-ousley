# Requirements Document

## Introduction

This specification defines the requirements for implementing legally compliant Privacy Policy and Terms of Use pages for daltonousley.com, a portfolio website that collects contact information through a form. The system must comply with GDPR (for EU visitors), CCPA (for California residents), and general data protection best practices while storing data in AWS DynamoDB (US-East-1).

## Glossary

- **System**: The daltonousley.com portfolio website and its backend services
- **Contact_Form**: The web form that collects name, email, company, and message from visitors
- **Data_Store**: AWS DynamoDB table in us-east-1 (Virginia, USA) that stores contact form submissions
- **Privacy_Policy**: Legal document describing data collection, use, storage, and user rights
- **Terms_of_Use**: Legal document defining acceptable use and liability limitations
- **Data_Subject**: Any individual whose personal data is collected by the System
- **GDPR**: General Data Protection Regulation (EU law)
- **CCPA**: California Consumer Privacy Act
- **Consent_Mechanism**: UI element requiring explicit user agreement before form submission
- **TTL**: Time-to-live automatic deletion mechanism (18 months)
- **Bot_Protection**: Cloudflare Turnstile service for preventing automated submissions
- **Email_Service**: Resend service for sending notification emails
- **Privacy_Request**: Formal request from Data_Subject to access, delete, or port their data

## Requirements

### Requirement 1: Privacy Policy Page

**User Story:** As a website visitor, I want to read a clear Privacy Policy, so that I understand how my personal data will be collected, used, and protected.

#### Acceptance Criteria

1. THE System SHALL display a Privacy Policy page at the URL path /privacy
2. WHEN the Privacy Policy is displayed, THE System SHALL include the date of last update
3. THE Privacy_Policy SHALL disclose all personal data collected (name, email, company, message)
4. THE Privacy_Policy SHALL disclose the legal basis for data processing under GDPR (legitimate interest for contact requests)
5. THE Privacy_Policy SHALL disclose data storage location (AWS DynamoDB, us-east-1, Virginia, USA)
6. THE Privacy_Policy SHALL disclose data retention period (18 months with automatic TTL deletion)
7. THE Privacy_Policy SHALL disclose third-party services (Cloudflare Turnstile, Resend, AWS)
8. THE Privacy_Policy SHALL explain Data_Subject rights under GDPR (access, rectification, erasure, portability, objection)
9. THE Privacy_Policy SHALL explain Data_Subject rights under CCPA (access, deletion, opt-out)
10. THE Privacy_Policy SHALL provide contact information for privacy-related inquiries
11. THE Privacy_Policy SHALL address international data transfers from EU to USA
12. THE Privacy_Policy SHALL disclose cookie usage (essential session/security cookies only)

### Requirement 2: Terms of Use Page

**User Story:** As a website visitor, I want to read clear Terms of Use, so that I understand the rules and limitations when using the website.

#### Acceptance Criteria

1. THE System SHALL display a Terms of Use page at the URL path /terms
2. WHEN the Terms of Use is displayed, THE System SHALL include the date of last update
3. THE Terms_of_Use SHALL define acceptable use of the website
4. THE Terms_of_Use SHALL define prohibited activities (spam, malicious content, impersonation)
5. THE Terms_of_Use SHALL include liability limitations and disclaimers
6. THE Terms_of_Use SHALL specify governing law and jurisdiction
7. THE Terms_of_Use SHALL address intellectual property rights
8. THE Terms_of_Use SHALL include contact information for legal inquiries

### Requirement 3: Consent Mechanism

**User Story:** As a website owner, I want users to explicitly consent to the Privacy Policy before submitting the contact form, so that I have documented proof of consent for GDPR compliance.

#### Acceptance Criteria

1. WHEN the Contact_Form is displayed, THE System SHALL include a consent checkbox before the submit button
2. THE Consent_Mechanism SHALL include clickable links to both Privacy_Policy and Terms_of_Use
3. WHEN the consent checkbox is unchecked, THE System SHALL disable the form submit button
4. WHEN a user attempts to submit without consent, THE System SHALL prevent submission and display an error message
5. WHEN consent is given and form is submitted, THE System SHALL record the consent timestamp with the submission data
6. THE Consent_Mechanism SHALL use clear, plain language (not pre-checked, explicit opt-in)

### Requirement 4: Footer Navigation

**User Story:** As a website visitor, I want to easily find Privacy Policy and Terms of Use links, so that I can review them before providing my information.

#### Acceptance Criteria

1. THE System SHALL display links to Privacy_Policy and Terms_of_Use in the website footer
2. THE System SHALL display these links on all pages of the website
3. WHEN a footer link is clicked, THE System SHALL navigate to the corresponding policy page
4. THE System SHALL visually distinguish policy links from other footer content

### Requirement 5: Data Subject Rights Request Handling

**User Story:** As a data subject, I want to exercise my privacy rights (access, deletion, portability), so that I can control my personal data.

#### Acceptance Criteria

1. THE Privacy_Policy SHALL provide an email address for submitting Privacy_Request
2. WHEN a Data_Subject requests data access, THE System SHALL provide all stored personal data within 30 days
3. WHEN a Data_Subject requests data deletion, THE System SHALL delete all personal data within 30 days and confirm deletion
4. WHEN a Data_Subject requests data portability, THE System SHALL provide data in machine-readable format (JSON) within 30 days
5. THE System SHALL verify the identity of the Data_Subject before fulfilling Privacy_Request
6. THE System SHALL maintain a log of all Privacy_Request and their resolution

### Requirement 6: GDPR Compliance for International Data Transfers

**User Story:** As a website owner, I want to comply with GDPR requirements for transferring EU personal data to the USA, so that I avoid legal penalties and protect user privacy.

#### Acceptance Criteria

1. THE Privacy_Policy SHALL disclose that data is transferred from EU to USA (AWS us-east-1)
2. THE Privacy_Policy SHALL explain the legal mechanism for international transfers (consent or legitimate interest)
3. THE Privacy_Policy SHALL inform EU visitors of their right to object to international transfers
4. THE Privacy_Policy SHALL explain security measures protecting data during transfer and storage
5. WHERE a Data_Subject objects to international transfer, THE System SHALL not process their contact form submission

### Requirement 7: Security and Data Protection Measures

**User Story:** As a website owner, I want to implement and document security measures, so that personal data is protected from unauthorized access and breaches.

#### Acceptance Criteria

1. THE Privacy_Policy SHALL describe technical security measures (encryption in transit via HTTPS, encryption at rest in DynamoDB)
2. THE Privacy_Policy SHALL describe organizational security measures (access controls, regular security reviews)
3. THE Privacy_Policy SHALL describe the data breach notification process
4. THE System SHALL use HTTPS for all data transmission
5. THE Data_Store SHALL use AWS DynamoDB encryption at rest
6. THE System SHALL implement access controls limiting who can view stored contact data

### Requirement 8: Cookie Disclosure

**User Story:** As a website visitor, I want to know what cookies are used, so that I can make informed decisions about my privacy.

#### Acceptance Criteria

1. THE Privacy_Policy SHALL list all cookies used by the System
2. THE Privacy_Policy SHALL categorize cookies (essential, functional, analytics, marketing)
3. THE Privacy_Policy SHALL explain the purpose of each cookie category
4. WHERE only essential cookies are used, THE System SHALL not require a cookie consent banner
5. WHERE non-essential cookies are used, THE System SHALL display a cookie consent banner before setting cookies

### Requirement 9: Contact Information for Legal Matters

**User Story:** As a data subject or legal authority, I want clear contact information, so that I can reach the website owner for privacy or legal matters.

#### Acceptance Criteria

1. THE Privacy_Policy SHALL include an email address for privacy inquiries
2. THE Terms_of_Use SHALL include an email address for legal inquiries
3. THE System SHALL respond to privacy inquiries within 5 business days
4. THE System SHALL respond to legal inquiries within 5 business days

### Requirement 10: Policy Update Notification

**User Story:** As a returning visitor, I want to be notified of policy changes, so that I can review updated terms before continuing to use the website.

#### Acceptance Criteria

1. WHEN Privacy_Policy or Terms_of_Use are updated, THE System SHALL update the "Last Updated" date
2. THE System SHALL maintain version history of policy changes
3. WHERE material changes are made, THE Privacy_Policy SHALL explain how users will be notified
4. THE System SHALL consider material changes to include: new data collection, new third parties, reduced user rights

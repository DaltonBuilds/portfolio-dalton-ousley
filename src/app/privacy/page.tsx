import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Mail, Clock, Database, Globe, Lock, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import SectionHeader from '@/components/SectionHeader';

export const metadata: Metadata = {
  title: 'Privacy Policy - Dalton Ousley',
  description: 'Privacy Policy for daltonousley.dev - Learn how we collect, use, and protect your personal data in compliance with GDPR and CCPA.',
};

const LAST_UPDATED = 'February 13, 2026';
const CONTACT_EMAIL = 'privacy@daltonousley.dev';

export default function PrivacyPolicyPage() {
  return (
    <div className="relative w-full">
      <section className="container mx-auto max-w-4xl py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <p className="text-sm">Last Updated: {LAST_UPDATED}</p>
          </div>
        </div>

        <Card className="glass border-2 border-blue-500/20 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Your Privacy Matters</h2>
                <p className="text-foreground/90">
                  This Privacy Policy explains how daltonousley.dev ("we", "us", or "our") collects, uses, and protects your personal information when you use our website and contact form. We are committed to transparency and compliance with GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            What Data We Collect
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                When you submit our contact form, we collect the following personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
                <li><strong>Name:</strong> Your full name or preferred name</li>
                <li><strong>Email Address:</strong> Your email address for communication</li>
                <li><strong>Company:</strong> Your company or organization name (optional)</li>
                <li><strong>Message:</strong> The content of your inquiry or message</li>
                <li><strong>Consent Record:</strong> Timestamp of when you agreed to this Privacy Policy</li>
                <li><strong>Technical Data:</strong> IP address (for verification purposes only)</li>
              </ul>
              <p className="text-foreground/90">
                We do not collect any other personal data through cookies, tracking pixels, or analytics tools. We only use essential session cookies required for website security and functionality.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Legal Basis */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Legal Basis for Processing (GDPR)
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                Under GDPR, we process your personal data based on the following legal grounds:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
                <li><strong>Consent:</strong> You explicitly consent to our collection and processing of your data by checking the consent checkbox before submitting the contact form.</li>
                <li><strong>Legitimate Interest:</strong> We have a legitimate interest in responding to your inquiries and maintaining records of our communications.</li>
              </ul>
              <p className="text-foreground/90">
                You have the right to withdraw your consent at any time by submitting a deletion request (see "Your Rights" section below).
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Data Storage */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Where We Store Your Data
          </h2>
          <Card className="glass border-2 border-orange-500/20">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-1" />
                <p className="text-foreground/90">
                  <strong>International Data Transfer Notice:</strong> Your personal data is stored in AWS DynamoDB located in the <strong>us-east-1 region (Virginia, USA)</strong>. If you are located in the European Union or European Economic Area, this means your data will be transferred from the EU to the United States.
                </p>
              </div>
              <p className="text-foreground/90">
                We rely on your explicit consent as the legal mechanism for this international data transfer. By submitting the contact form and agreeing to this Privacy Policy, you consent to the transfer of your personal data to the United States.
              </p>
              <p className="text-foreground/90">
                <strong>Data Protection Measures:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
                <li>All data is encrypted in transit using HTTPS/TLS</li>
                <li>All data is encrypted at rest using AWS DynamoDB encryption</li>
                <li>Access to data is restricted to authorized personnel only</li>
                <li>We conduct regular security reviews and updates</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Data Retention */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            How Long We Keep Your Data
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                We retain your contact form submission for <strong>18 months</strong> from the date of submission. After 18 months, your data is automatically deleted using AWS DynamoDB's Time-to-Live (TTL) feature.
              </p>
              <p className="text-foreground/90">
                You can request earlier deletion of your data at any time by submitting a deletion request (see "Your Rights" section below).
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Third Parties */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Third-Party Services
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                We use the following third-party services to operate our website and contact form:
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">AWS (Amazon Web Services)</h3>
                  <p className="text-foreground/90">
                    We use AWS DynamoDB to store contact form submissions. AWS is a trusted cloud provider with robust security measures and compliance certifications (SOC 2, ISO 27001, GDPR-compliant).
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Cloudflare Turnstile</h3>
                  <p className="text-foreground/90">
                    We use Cloudflare Turnstile for bot protection on our contact form. Turnstile may process your IP address and browser information to verify you are human. Cloudflare's privacy policy applies: <Link href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">cloudflare.com/privacypolicy</Link>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Resend</h3>
                  <p className="text-foreground/90">
                    We use Resend to send email notifications when you submit the contact form. Resend processes your email address and message content solely for the purpose of delivering the email. Resend's privacy policy applies: <Link href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">resend.com/legal/privacy-policy</Link>
                  </p>
                </div>
              </div>
              <p className="text-foreground/90">
                We do not sell, rent, or share your personal data with any other third parties for marketing purposes.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Your Rights - GDPR */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Your Rights Under GDPR
          </h2>
          <Card className="glass border-2 border-green-500/20">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                If you are located in the European Union or European Economic Area, you have the following rights under GDPR:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
                <li><strong>Right to Access:</strong> You can request a copy of all personal data we hold about you.</li>
                <li><strong>Right to Rectification:</strong> You can request correction of inaccurate or incomplete data.</li>
                <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> You can request deletion of your personal data.</li>
                <li><strong>Right to Data Portability:</strong> You can request your data in a machine-readable format (JSON).</li>
                <li><strong>Right to Object:</strong> You can object to the processing of your personal data, including international transfers.</li>
                <li><strong>Right to Withdraw Consent:</strong> You can withdraw your consent at any time.</li>
                <li><strong>Right to Lodge a Complaint:</strong> You can file a complaint with your local data protection authority.</li>
              </ul>
              <p className="text-foreground/90">
                To exercise any of these rights, please contact us at <Link href={`mailto:${CONTACT_EMAIL}`} className="text-blue-400 hover:underline">{CONTACT_EMAIL}</Link>. We will respond to your request within 30 days.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Your Rights - CCPA */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Your Rights Under CCPA
          </h2>
          <Card className="glass border-2 border-purple-500/20">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
                <li><strong>Right to Know:</strong> You can request disclosure of the categories and specific pieces of personal information we have collected about you.</li>
                <li><strong>Right to Delete:</strong> You can request deletion of your personal information.</li>
                <li><strong>Right to Opt-Out:</strong> You have the right to opt-out of the "sale" of your personal information. Note: We do not sell personal information.</li>
                <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights.</li>
              </ul>
              <p className="text-foreground/90">
                To exercise any of these rights, please contact us at <Link href={`mailto:${CONTACT_EMAIL}`} className="text-blue-400 hover:underline">{CONTACT_EMAIL}</Link>. We will verify your identity and respond within 45 days.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Security */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lock className="h-6 w-6 text-primary" />
            Security Measures
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                We implement industry-standard security measures to protect your personal data:
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-1">Technical Measures:</h3>
                  <ul className="list-disc list-inside space-y-1 text-foreground/90 ml-4">
                    <li>HTTPS/TLS encryption for all data in transit</li>
                    <li>AWS DynamoDB encryption at rest (AES-256)</li>
                    <li>Bot protection via Cloudflare Turnstile</li>
                    <li>Regular security updates and patches</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Organizational Measures:</h3>
                  <ul className="list-disc list-inside space-y-1 text-foreground/90 ml-4">
                    <li>Access controls limiting who can view stored data</li>
                    <li>Regular security audits and reviews</li>
                    <li>Data minimization practices</li>
                    <li>Incident response procedures</li>
                  </ul>
                </div>
              </div>
              <p className="text-foreground/90">
                <strong>Data Breach Notification:</strong> In the unlikely event of a data breach that affects your personal information, we will notify you and relevant authorities within 72 hours as required by GDPR.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Cookie Policy
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                We use only <strong>essential cookies</strong> required for website security and functionality. We do not use analytics, marketing, or tracking cookies.
              </p>
              <div>
                <h3 className="font-semibold mb-2">Essential Cookies:</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground/90 ml-4">
                  <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser, used for security and form functionality</li>
                  <li><strong>Security Cookies:</strong> Used by Cloudflare Turnstile for bot protection</li>
                </ul>
              </div>
              <p className="text-foreground/90">
                Because we only use essential cookies, we do not require a cookie consent banner. Essential cookies are necessary for the website to function and are exempt from consent requirements under GDPR and ePrivacy Directive.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Contact Us
          </h2>
          <Card className="glass border-2 border-blue-500/20">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                If you have any questions about this Privacy Policy or wish to exercise your data protection rights, please contact us:
              </p>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="font-semibold mb-2">Privacy Inquiries:</p>
                <p className="text-foreground/90">
                  Email: <Link href={`mailto:${CONTACT_EMAIL}`} className="text-blue-400 hover:underline">{CONTACT_EMAIL}</Link>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  We will respond to all privacy inquiries within 5 business days and fulfill data subject rights requests within 30 days.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Policy Updates */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Policy Updates
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we make changes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
                <li>We will update the "Last Updated" date at the top of this page</li>
                <li>We will maintain a version history of policy changes</li>
                <li>For material changes (new data collection, new third parties, reduced user rights), we will notify users via email if we have their contact information</li>
              </ul>
              <p className="text-foreground/90">
                We encourage you to review this Privacy Policy periodically to stay informed about how we protect your data.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Footer Navigation */}
        <div className="flex flex-wrap gap-4 justify-center pt-8 border-t border-border">
          <Link href="/terms" className="text-blue-400 hover:underline">
            Terms of Use
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/" className="text-blue-400 hover:underline">
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}

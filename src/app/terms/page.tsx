import { Metadata } from 'next';
import Link from 'next/link';
import { Scale, Mail, Clock, AlertTriangle, FileText, Shield, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { getCurrentVersion, hasVersionHistory } from '@/lib/policy-versions';

export const metadata: Metadata = {
  title: 'Terms of Use - Dalton Ousley',
  description: 'Terms of Use for daltonousley.dev - Understand the rules and guidelines for using our website.',
};

const currentVersion = getCurrentVersion('terms');
const LAST_UPDATED = currentVersion.lastUpdated;
const VERSION = currentVersion.version;
const CONTACT_EMAIL = 'legal@daltonousley.dev';

export default function TermsOfUsePage() {
  return (
    <div className="relative w-full">
      <section className="container mx-auto max-w-4xl py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Terms of Use
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <p className="text-sm">Last Updated: {LAST_UPDATED}</p>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <p className="text-sm">Version: {VERSION}</p>
            </div>
          </div>
          {hasVersionHistory('terms') && (
            <div className="mt-2">
              <Link href="/terms/history" className="text-sm text-blue-400 hover:underline">
                View version history
              </Link>
            </div>
          )}
        </div>

        <Card className="glass border-2 border-purple-500/20 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Scale className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Agreement to Terms</h2>
                <p className="text-foreground/90">
                  By accessing or using daltonousley.dev (the "Website"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Website.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acceptable Use */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Acceptable Use
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                You agree to use the Website only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
                <li>Use the Website in any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Website</li>
                <li>Use the Website to transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                <li>Impersonate or attempt to impersonate the Website owner, another user, or any other person or entity</li>
                <li>Engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Website, or which may harm the Website or users of the Website</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Prohibited Activities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-primary" />
            Prohibited Activities
          </h2>
          <Card className="glass border-2 border-red-500/20">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                The following activities are strictly prohibited when using the Website:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
                <li><strong>Spam:</strong> Submitting unsolicited or repetitive messages through the contact form</li>
                <li><strong>Malicious Content:</strong> Attempting to transmit viruses, malware, or any other malicious code</li>
                <li><strong>Automated Access:</strong> Using bots, scrapers, or automated tools to access the Website (except for legitimate search engine crawlers)</li>
                <li><strong>Security Violations:</strong> Attempting to gain unauthorized access to any portion of the Website, other accounts, computer systems, or networks</li>
                <li><strong>Interference:</strong> Interfering with or disrupting the Website or servers or networks connected to the Website</li>
                <li><strong>Impersonation:</strong> Falsely representing your identity or affiliation with any person or organization</li>
                <li><strong>Harassment:</strong> Harassing, threatening, or abusing any person through the contact form or any other means</li>
              </ul>
              <p className="text-foreground/90">
                Violation of these prohibitions may result in termination of your access to the Website and may be reported to law enforcement authorities.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Intellectual Property */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Intellectual Property Rights
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                The Website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Dalton Ousley, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
              <p className="text-foreground/90">
                You may view, download, and print pages from the Website for your personal, non-commercial use, subject to the restrictions set out in these Terms. You must not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
                <li>Modify copies of any materials from the Website</li>
                <li>Use any illustrations, photographs, video or audio sequences, or any graphics separately from the accompanying text</li>
                <li>Delete or alter any copyright, trademark, or other proprietary rights notices from copies of materials from the Website</li>
                <li>Reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on the Website for commercial purposes without prior written consent</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* User Content */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            User-Submitted Content
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                When you submit content through the contact form (including your name, email, company, and message), you grant us a non-exclusive, royalty-free, worldwide license to use, store, and process that content solely for the purpose of responding to your inquiry and maintaining records of our communications.
              </p>
              <p className="text-foreground/90">
                You represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
                <li>You own or control all rights to the content you submit</li>
                <li>The content is accurate and not misleading</li>
                <li>The content does not violate these Terms or any applicable law</li>
                <li>The content will not cause injury to any person or entity</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Disclaimer */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-primary" />
            Disclaimer of Warranties
          </h2>
          <Card className="glass border-2 border-yellow-500/20">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90 uppercase font-semibold">
                The Website is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied.
              </p>
              <p className="text-foreground/90">
                We do not warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
                <li>The Website will be available at all times or without interruption</li>
                <li>The Website will be error-free or that defects will be corrected</li>
                <li>The Website or the server that makes it available are free of viruses or other harmful components</li>
                <li>The information on the Website is accurate, complete, or current</li>
              </ul>
              <p className="text-foreground/90">
                Your use of the Website is at your own risk. We disclaim all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            Limitation of Liability
          </h2>
          <Card className="glass border-2 border-orange-500/20">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90 uppercase font-semibold">
                To the fullest extent permitted by applicable law, in no event shall Dalton Ousley, its affiliates, licensors, service providers, employees, agents, officers, or directors be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Website.
              </p>
              <p className="text-foreground/90">
                This includes, but is not limited to, damages for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
                <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                <li>Unauthorized access to or alteration of your transmissions or data</li>
                <li>Statements or conduct of any third party on the Website</li>
                <li>Any other matter relating to the Website</li>
              </ul>
              <p className="text-foreground/90">
                Our total liability to you for all claims arising out of or related to the Website shall not exceed $100 USD.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Indemnification */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Indemnification
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                You agree to defend, indemnify, and hold harmless Dalton Ousley, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
                <li>Your violation of these Terms of Use</li>
                <li>Your use of the Website</li>
                <li>Your violation of any rights of another person or entity</li>
                <li>Any content you submit through the contact form</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Governing Law */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Governing Law and Jurisdiction
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                These Terms of Use and any dispute or claim arising out of or related to them, their subject matter, or their formation (in each case, including non-contractual disputes or claims) shall be governed by and construed in accordance with the laws of the <strong>State of Texas, United States</strong>, without giving effect to any choice or conflict of law provision or rule.
              </p>
              <p className="text-foreground/90">
                Any legal suit, action, or proceeding arising out of or related to these Terms of Use or the Website shall be instituted exclusively in the federal courts of the United States or the courts of the State of Texas. You waive any and all objections to the exercise of jurisdiction over you by such courts and to venue in such courts.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Dispute Resolution */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            Dispute Resolution
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                If you have any dispute with us relating to the Website or these Terms, you agree to first contact us at <Link href={`mailto:${CONTACT_EMAIL}`} className="text-blue-400 hover:underline">{CONTACT_EMAIL}</Link> and attempt to resolve the dispute informally.
              </p>
              <p className="text-foreground/90">
                If we cannot resolve the dispute within 30 days, either party may pursue formal legal action as described in the Governing Law section above.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Severability */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Severability and Waiver
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Severability</h3>
                <p className="text-foreground/90">
                  If any provision of these Terms is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not be affected or impaired.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Waiver</h3>
                <p className="text-foreground/90">
                  No waiver by us of any term or condition set out in these Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure to assert a right or provision under these Terms shall not constitute a waiver of such right or provision.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Entire Agreement */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Entire Agreement
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                These Terms of Use, together with our Privacy Policy, constitute the sole and entire agreement between you and Dalton Ousley regarding the Website and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding the Website.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Changes to Terms */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Changes to Terms
          </h2>
          <Card className="glass">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                We reserve the right to modify or replace these Terms at any time at our sole discretion. When we make changes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
                <li>We will update the "Last Updated" date at the top of this page</li>
                <li>We will maintain a version history of terms changes</li>
                <li>For material changes, we will provide notice on the Website or via email if we have your contact information</li>
              </ul>
              <p className="text-foreground/90">
                Your continued use of the Website after any changes to these Terms constitutes your acceptance of the new Terms. If you do not agree to the revised Terms, you must stop using the Website.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Contact Information
          </h2>
          <Card className="glass border-2 border-blue-500/20">
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground/90">
                If you have any questions about these Terms of Use, please contact us:
              </p>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="font-semibold mb-2">Legal Inquiries:</p>
                <p className="text-foreground/90">
                  Email: <Link href={`mailto:${CONTACT_EMAIL}`} className="text-blue-400 hover:underline">{CONTACT_EMAIL}</Link>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  We will respond to all legal inquiries within 5 business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Acknowledgment */}
        <section className="mb-12">
          <Card className="glass border-2 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Acknowledgment</h2>
                  <p className="text-foreground/90">
                    By using the Website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer Navigation */}
        <div className="flex flex-wrap gap-4 justify-center pt-8 border-t border-border">
          <Link href="/privacy" className="text-blue-400 hover:underline">
            Privacy Policy
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

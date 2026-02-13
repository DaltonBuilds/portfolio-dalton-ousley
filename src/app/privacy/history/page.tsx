import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, FileText, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { getAllVersions } from '@/lib/policy-versions';

export const metadata: Metadata = {
  title: 'Privacy Policy Version History - Dalton Ousley',
  description: 'View the complete version history of our Privacy Policy.',
};

export default function PrivacyPolicyHistoryPage() {
  const versions = getAllVersions('privacy');

  return (
    <div className="relative w-full">
      <section className="container mx-auto max-w-4xl py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/privacy" className="inline-flex items-center gap-2 text-blue-400 hover:underline mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Privacy Policy
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Privacy Policy Version History
          </h1>
          <p className="text-muted-foreground">
            This page shows all versions of our Privacy Policy and the changes made over time.
          </p>
        </div>

        <div className="space-y-6">
          {versions.map((version, index) => (
            <Card key={version.version} className={`glass ${index === 0 ? 'border-2 border-blue-500/20' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">Version {version.version}</h2>
                      {index === 0 && (
                        <span className="px-2 py-1 text-xs font-semibold bg-blue-500/20 text-blue-400 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Effective: {version.effectiveDate.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      {version.endDate && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Ended: {version.endDate.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {version.changes && version.changes.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Changes in this version:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-foreground/90 ml-4">
                      {version.changes.map((change, changeIndex) => (
                        <li key={changeIndex}>{change}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-foreground/90">
            <strong>Note:</strong> Material changes to our Privacy Policy are communicated to users via email 
            when we have contact information. You can always view the current policy and its history on this website.
          </p>
        </div>
      </section>
    </div>
  );
}

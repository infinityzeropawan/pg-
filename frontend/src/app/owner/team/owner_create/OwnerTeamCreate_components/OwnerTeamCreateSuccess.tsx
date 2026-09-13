// RESPONSIBILITY: Renders the OwnerTeamCreateSuccess component. Receives data via props/hooks.

import { CheckCircle2, Copy } from 'lucide-react';
import Link from 'next/link';

export interface OwnerTeamCreateSuccessProps {
  successData: { email: string, password: string, loginUrl: string };
}

export function OwnerTeamCreateSuccess({ successData }: OwnerTeamCreateSuccessProps) {
  const copyToClipboard = () => {
    const text = `Login URL: ${window.location.origin}${successData.loginUrl}\nEmail: ${successData.email}\nPassword: ${successData.password}`;
    navigator.clipboard.writeText(text);
    alert('Copied credentials to clipboard!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="bg-card border border-success rounded-lg p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-[rgba(16,185,129,0.1)] rounded-full flex items-center justify-center mx-auto text-success">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">Team Member Created!</h2>
          <p className="text-secondary text-sm">
            They can now log in using the credentials below. They will be forced to change this password on their first login.
          </p>
        </div>

        <div className="bg-page border border-border rounded-md p-6 text-left space-y-4 max-w-md mx-auto relative">
          <button onClick={copyToClipboard} className="absolute top-4 right-4 p-2 text-secondary hover:text-primary bg-input rounded-md motion-safe:transition-colors" title="Copy to clipboard">
            <Copy className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs text-secondary mb-1">Login URL</div>
            <div className="font-mono text-sm text-primary">{window.location.origin}{successData.loginUrl}</div>
          </div>
          <div>
            <div className="text-xs text-secondary mb-1">Email</div>
            <div className="font-mono text-sm text-primary">{successData.email}</div>
          </div>
          <div>
            <div className="text-xs text-secondary mb-1">Temporary Password</div>
            <div className="font-mono text-sm text-primary">{successData.password}</div>
          </div>
        </div>

        <Link href="/owner/team" className="inline-block mt-4 bg-primary text-white px-6 py-2.5 rounded-md font-medium hover:bg-primary-hover motion-safe:transition-colors text-sm">
          Back to Team Directory
        </Link>
      </div>
    </div>
  );
}

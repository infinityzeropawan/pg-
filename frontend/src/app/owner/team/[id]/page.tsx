// RESPONSIBILITY: Renders the OwnerPage component. Receives data via props/hooks.

import { OwnerTeamDetailsMain } from '@/app/owner/team/[id]/OwnerTeamDetails_components/OwnerTeamDetailsMain';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <OwnerTeamDetailsMain />;
}

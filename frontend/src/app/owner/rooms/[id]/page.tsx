// RESPONSIBILITY: Renders the OwnerPage component. Receives data via props/hooks.

import { OwnerRoomsDetailsMain } from '@/app/owner/rooms/[id]/OwnerRoomsDetails_components/OwnerRoomsDetailsMain';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <OwnerRoomsDetailsMain params={params} />;
}

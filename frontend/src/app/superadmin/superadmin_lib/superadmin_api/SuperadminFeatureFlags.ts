import { superadminRequest } from './SuperadminClient';

export const featureFlagsApi = {
  list: () => superadminRequest<any[]>('/feature-flags'),
  update: (key: string, ownerId: string | undefined, isEnabled: boolean) => superadminRequest('/feature-flags', { method: 'PUT', body: JSON.stringify({ key, ownerId, isEnabled }) }),
};

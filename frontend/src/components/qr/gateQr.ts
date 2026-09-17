// RESPONSIBILITY: Data access + payload helpers for the printable gate QR poster.
//
// The poster is generated from a signed token issued by the backend
// (`GET /properties/:propertyId/gate-qr`) and drawn as a real QR code. The previous
// modal painted a hash-based pseudo-QR that no scanner could ever decode.

import { adminRequest } from '@/app/owner/owner_lib/owner_api/AdminClient';
import { buildScanUrl } from '@/lib/utils/gateQr';

export interface GateQrInfo {
  propertyId: string;
  propertyName: string;
  address: string;
  contactPhone: string;
  curfewTime: string;
  /** Signed token (`spg1.<propertyId>.<signature>`) validated on every scan. */
  token: string;
  /** Route the QR deep-links to, e.g. `/student/attendance?gate=<token>`. */
  scanPath: string;
}

export const gateQrApi = {
  fetch: async (propertyId: string): Promise<GateQrInfo> =>
    adminRequest<GateQrInfo>(`/properties/${encodeURIComponent(propertyId)}/gate-qr`),
};

/**
 * Absolute URL encoded into the QR. Using the origin the poster is printed from
 * means the deep link always points at the deployment the owner is actually using.
 */
export function buildGateScanUrl(info: GateQrInfo, origin?: string): string {
  return buildScanUrl(info.scanPath, origin);
}

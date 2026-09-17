// RESPONSIBILITY: Verifies the gate QR payload contract and that the printed code is
// genuinely machine-readable.
//
// BUG HISTORY: the poster used to render `generateQrMatrix()` — a sine/hash noise grid
// with no QR version, no format information and no error correction. The payload was
// never encoded, so nothing could ever scan it. The round-trip test below decodes the
// exact payload the poster carries, which is the strongest check we can make without
// physically printing the sheet.

import { describe, expect, it } from 'vitest';
import jsQR from 'jsqr';
import QRCode from 'qrcode';

import { GATE_TOKEN_PREFIX, buildScanUrl, extractGateToken, isGateQrPayload } from '@/lib/utils/gateQr';
import { businessDayKey, businessMonthKey } from '@/lib/utils/datetime';

const TOKEN = `${GATE_TOKEN_PREFIX}.11111111-2222-3333-4444-555555555555.s1gn4tur3_value-AB`;

describe('extractGateToken', () => {
  it('accepts a bare token and trims surrounding whitespace', () => {
    expect(extractGateToken(TOKEN)).toBe(TOKEN);
    expect(extractGateToken(`  ${TOKEN}\n`)).toBe(TOKEN);
  });

  it('accepts the deep link that is printed on the poster', () => {
    const url = buildScanUrl(`/student/attendance?gate=${TOKEN}`, 'https://pg.example.com');
    expect(extractGateToken(url)).toBe(TOKEN);
    expect(isGateQrPayload(url)).toBe(true);
  });

  it('rejects anything that is not a gate poster', () => {
    expect(extractGateToken('https://pg.example.com/student/attendance')).toBeNull();
    expect(extractGateToken('WIFI:S:PG-WiFi;T:WPA;P:secret;;')).toBeNull();
    expect(extractGateToken('hello world')).toBeNull();
    expect(extractGateToken('')).toBeNull();
    expect(extractGateToken(null)).toBeNull();
    expect(extractGateToken(undefined)).toBeNull();
    expect(isGateQrPayload('https://example.com')).toBe(false);
  });
});

describe('buildScanUrl', () => {
  it('prefixes the deployment origin so the phone camera opens the right app', () => {
    expect(buildScanUrl('/student/attendance?gate=X', 'https://pg.example.com')).toBe(
      'https://pg.example.com/student/attendance?gate=X'
    );
  });
});

describe('business day keys', () => {
  it('matches the day the backend stores (IST, not UTC)', () => {
    // 18:45Z is already the next day in IST.
    expect(businessDayKey('2026-01-01T18:45:00.000Z')).toBe('2026-01-02');
    expect(businessMonthKey('2026-01-01T18:45:00.000Z')).toBe('2026-01');
    // 18:29Z is still 23:59 IST on the same day.
    expect(businessDayKey('2026-01-01T18:29:00.000Z')).toBe('2026-01-01');
  });

  it('returns an empty key for unusable input instead of throwing', () => {
    expect(businessDayKey('not-a-date')).toBe('');
  });
});

/** Rasterises a QR code (4-module quiet zone) into the RGBA buffer jsQR expects. */
function rasterize(text: string, targetSize = 264) {
  const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
  const quietZone = 4;
  const scale = Math.max(1, Math.floor(targetSize / (qr.modules.size + quietZone * 2)));
  const width = (qr.modules.size + quietZone * 2) * scale;

  const data = new Uint8ClampedArray(width * width * 4).fill(255);
  for (let row = 0; row < qr.modules.size; row += 1) {
    for (let col = 0; col < qr.modules.size; col += 1) {
      if (!qr.modules.get(row, col)) continue;
      for (let y = 0; y < scale; y += 1) {
        for (let x = 0; x < scale; x += 1) {
          const offset = ((row + quietZone) * scale + y) * width + ((col + quietZone) * scale + x);
          data[offset * 4] = 0;
          data[offset * 4 + 1] = 0;
          data[offset * 4 + 2] = 0;
          data[offset * 4 + 3] = 255;
        }
      }
    }
  }

  return { data, width, height: width };
}

describe('poster scannability', () => {
  it('the deep link survives a real encode -> decode round trip', () => {
    const url = buildScanUrl(`/student/attendance?gate=${TOKEN}`, 'https://pg.example.com');
    const image = rasterize(url);

    const decoded = jsQR(image.data, image.width, image.height);

    expect(decoded).not.toBeNull();
    // Byte-for-byte identical payload — the camera reads exactly what we printed.
    expect(decoded?.data).toBe(url);
    // And the app turns that payload into the token the backend verifies.
    expect(extractGateToken(decoded?.data)).toBe(TOKEN);
  });

  it('a bare token payload also survives the round trip', () => {
    const image = rasterize(TOKEN);
    const decoded = jsQR(image.data, image.width, image.height);

    expect(decoded?.data).toBe(TOKEN);
    expect(extractGateToken(decoded?.data)).toBe(TOKEN);
  });
});

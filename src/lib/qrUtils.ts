import QRCode from 'qrcode';
import { CardData } from '@/types/card';

function escapeVCard(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

export async function generateVCardQR(data: CardData): Promise<string> {
  // Build vCard format
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    data.name ? `FN:${escapeVCard(data.name)}` : '',
    data.name ? `N:;${escapeVCard(data.name)};;;` : '',
    data.title ? `TITLE:${escapeVCard(data.title)}` : '',
    data.company ? `ORG:${escapeVCard(data.company)}` : '',
    data.phone ? `TEL:${data.phone}` : '',
    data.email ? `EMAIL:${data.email}` : '',
    data.website ? `URL:${data.website}` : '',
    data.address ? `ADR:;;${escapeVCard(data.address)};;;;` : '',
    'END:VCARD'
  ].filter(Boolean).join('\r\n');

  try {
    return await QRCode.toDataURL(vcard, {
      margin: 0,
      width: 200,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    throw new Error(`QR code generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
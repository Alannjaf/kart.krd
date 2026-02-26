import QRCode from 'qrcode';
import { CardData } from '@/types/card';

export async function generateVCardQR(data: CardData): Promise<string> {
  // Build vCard format
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    data.name ? `FN:${data.name}` : '',
    data.title ? `TITLE:${data.title}` : '',
    data.company ? `ORG:${data.company}` : '',
    data.phone ? `TEL:${data.phone}` : '',
    data.email ? `EMAIL:${data.email}` : '',
    data.website ? `URL:${data.website}` : '',
    data.address ? `ADR:;;${data.address};;;;` : '',
    'END:VCARD'
  ].filter(Boolean).join('\n');

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
    console.error('QR code generation failed:', error);
    return '';
  }
}
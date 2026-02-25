import { CardData } from '@/types/card';
import { toPng } from 'html-to-image';

const CARD_WIDTH_IN = 3.5;
const CARD_HEIGHT_IN = 2;

export async function generatePdf(
  element: HTMLElement,
  cardData: CardData
): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const dataUrl = await toPng(element, {
    pixelRatio: 3,
    cacheBust: true,
    includeQueryParams: true,
    filter: (node: HTMLElement) => {
      if (node.tagName === 'SCRIPT' || node.tagName === 'NOSCRIPT') return false;
      return true;
    },
    skipFonts: true,
  });

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'in',
    format: [CARD_WIDTH_IN, CARD_HEIGHT_IN],
    compress: true,
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, CARD_WIDTH_IN, CARD_HEIGHT_IN, undefined, 'FAST');

  // Watermark
  pdf.setFontSize(6);
  pdf.setTextColor(180, 180, 180);
  pdf.text('kart.krd', CARD_WIDTH_IN - 0.05, CARD_HEIGHT_IN - 0.05, { align: 'right' });

  const safeName = cardData.name
    ? cardData.name.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '').trim().replace(/\s+/g, '-')
    : 'business-card';

  pdf.save(`${safeName}-kart.krd.pdf`);
}

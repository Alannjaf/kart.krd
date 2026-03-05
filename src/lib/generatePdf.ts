import { CardData } from '@/types/card';
import { toPng } from 'html-to-image';

const CARD_WIDTH_IN = 3.5;
const CARD_HEIGHT_IN = 2;

export async function generatePdf(
  element: HTMLElement,
  cardData: CardData,
  showBackCallback?: (showBack: boolean) => Promise<void>
): Promise<void> {
  const { jsPDF } = await import('jspdf');

  // Check if back side has content (logo or QR code)
  const hasBackContent = cardData.logoUrl || cardData.qrEnabled;

  try {
    // Capture front side
    const frontDataUrl = await toPng(element, {
      pixelRatio: 3,
      cacheBust: true,
      includeQueryParams: true,
      filter: (node: HTMLElement) => {
        if (node.tagName === 'SCRIPT' || node.tagName === 'NOSCRIPT') return false;
        return true;
      },
      skipFonts: false,
    });

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: [CARD_WIDTH_IN, CARD_HEIGHT_IN],
      compress: true,
    });

    // Add front page
    pdf.addImage(frontDataUrl, 'PNG', 0, 0, CARD_WIDTH_IN, CARD_HEIGHT_IN, undefined, 'MEDIUM');

    // Watermark for front
    pdf.setFontSize(6);
    pdf.setTextColor(180, 180, 180);
    pdf.text('kart.krd', CARD_WIDTH_IN - 0.05, CARD_HEIGHT_IN - 0.05, { align: 'right' });

    // If back content exists and callback provided, capture back side
    if (hasBackContent && showBackCallback) {
      // Switch to back view
      await showBackCallback(true);

      // Wait for React re-render and fonts to be ready
      await new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });
      await document.fonts.ready;

      // Capture back side
      const backDataUrl = await toPng(element, {
        pixelRatio: 3,
        cacheBust: true,
        includeQueryParams: true,
        filter: (node: HTMLElement) => {
          if (node.tagName === 'SCRIPT' || node.tagName === 'NOSCRIPT') return false;
          return true;
        },
        skipFonts: false,
      });

      // Add new page for back
      pdf.addPage();
      pdf.addImage(backDataUrl, 'PNG', 0, 0, CARD_WIDTH_IN, CARD_HEIGHT_IN, undefined, 'MEDIUM');

      // Watermark for back
      pdf.setFontSize(6);
      pdf.setTextColor(180, 180, 180);
      pdf.text('kart.krd', CARD_WIDTH_IN - 0.05, CARD_HEIGHT_IN - 0.05, { align: 'right' });
    }

    pdf.setProperties({
      title: cardData.name || 'Business Card',
      creator: 'kart.krd',
      subject: 'Business Card',
    });

    const safeName = cardData.name
      ? cardData.name.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '').trim().replace(/\s+/g, '-')
      : 'business-card';

    pdf.save(`${safeName}-kart.krd.pdf`);
  } finally {
    // Always switch back to front view, even if capture fails
    if (hasBackContent && showBackCallback) {
      await showBackCallback(false);
    }
  }
}

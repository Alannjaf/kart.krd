import { CardData } from '@/types/card';

// Business card dimensions in inches
const CARD_WIDTH_IN = 3.5;
const CARD_HEIGHT_IN = 2;
// PDF resolution: 150 DPI gives a good balance of quality and file size
const DPI = 150;

export async function generatePdf(
  element: HTMLElement,
  cardData: CardData
): Promise<void> {
  // Dynamically import to avoid SSR issues
  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  // Capture the card element as canvas
  const canvas = await html2canvas(element, {
    scale: 2, // 2x for better quality
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    // Ensure full element is captured
    width: element.offsetWidth,
    height: element.offsetHeight,
  });

  // Create PDF at exact business card size
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'in',
    format: [CARD_WIDTH_IN, CARD_HEIGHT_IN],
  });

  // Add the image to fill the entire card
  const imgData = canvas.toDataURL('image/png', 1.0);
  pdf.addImage(imgData, 'PNG', 0, 0, CARD_WIDTH_IN, CARD_HEIGHT_IN);

  // Generate filename from name
  const safeName = cardData.name
    ? cardData.name.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '').trim().replace(/\s+/g, '-')
    : 'business-card';
  const filename = `${safeName}-kart.krd.pdf`;

  // Save the PDF
  pdf.save(filename);
}

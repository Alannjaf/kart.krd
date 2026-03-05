export type CardLanguage = 'ku' | 'ar' | 'en';

export type TemplateId = 'modern' | 'classic' | 'bold' | 'minimal' | 'elegant' | 'creative' | 'corporate' | 'gradient';

export interface CardData {
  // Personal info
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  // Social links
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  // Settings
  language: CardLanguage;
  template: TemplateId;
  // V2 features
  qrEnabled: boolean;
  logoUrl: string;
}

export const defaultCardData: CardData = {
  name: '',
  title: '',
  company: '',
  phone: '',
  email: '',
  website: '',
  address: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  twitter: '',
  language: 'ku',
  template: 'modern',
  qrEnabled: false,
  logoUrl: '',
};

export const TEMPLATES: { id: TemplateId }[] = [
  { id: 'modern' },
  { id: 'classic' },
  { id: 'bold' },
  { id: 'minimal' },
  { id: 'elegant' },
  { id: 'creative' },
  { id: 'corporate' },
  { id: 'gradient' },
];

export type CardLanguage = 'ku' | 'ar' | 'en';

export type TemplateId = 'modern' | 'classic' | 'bold' | 'minimal';

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
};

export const TEMPLATES: { id: TemplateId; label: string; labelKu: string; isFree: boolean }[] = [
  { id: 'modern', label: 'Modern', labelKu: 'مۆدێرن', isFree: true },
  { id: 'classic', label: 'Classic', labelKu: 'کلاسیک', isFree: false },
  { id: 'bold', label: 'Bold', labelKu: 'بۆڵد', isFree: false },
  { id: 'minimal', label: 'Minimal', labelKu: 'مینیمال', isFree: false },
];

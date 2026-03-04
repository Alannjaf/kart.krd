'use client';

import { forwardRef } from 'react';
import { CardData } from '@/types/card';
import ModernCard from './templates/ModernCard';
import ClassicCard from './templates/ClassicCard';
import BoldCard from './templates/BoldCard';
import MinimalCard from './templates/MinimalCard';
import ElegantCard from './templates/ElegantCard';
import CreativeCard from './templates/CreativeCard';
import CorporateCard from './templates/CorporateCard';
import GradientCard from './templates/GradientCard';
import BackCard from './BackCard';

interface Props {
  data: CardData;
  showBack?: boolean;
}

const CardPreview = forwardRef<HTMLDivElement, Props>(({ data, showBack = false }, ref) => {
  const renderTemplate = () => {
    if (showBack) {
      return <BackCard data={data} template={data.template} />;
    }

    switch (data.template) {
      case 'modern':
        return <ModernCard data={data} />;
      case 'classic':
        return <ClassicCard data={data} />;
      case 'bold':
        return <BoldCard data={data} />;
      case 'minimal':
        return <MinimalCard data={data} />;
      case 'elegant':
        return <ElegantCard data={data} />;
      case 'creative':
        return <CreativeCard data={data} />;
      case 'corporate':
        return <CorporateCard data={data} />;
      case 'gradient':
        return <GradientCard data={data} />;
      default:
        return <ModernCard data={data} />;
    }
  };

  return (
    <div
      ref={ref}
      className="w-full shadow-2xl rounded-lg overflow-hidden card-preview"
      style={{ aspectRatio: '3.5 / 2' }}
    >
      {renderTemplate()}
    </div>
  );
});

CardPreview.displayName = 'CardPreview';

export default CardPreview;

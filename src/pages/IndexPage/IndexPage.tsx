import { TarotApp } from '@/components/TarotApp';
import type { FC } from 'react';

export const IndexPage: FC = () => {
  const handleStart = () => {
    console.log('Tarot reading started');
  };

  const handleSpreadSelect = (spread: 'one' | 'three' | 'seven') => {
    console.log('Selected spread:', spread);
    // Here you can navigate to the reading page or show cards
    alert(`Вы выбрали расклад: ${spread === 'one' ? 'Одна карта' : spread === 'three' ? 'Три карты' : 'Семь карт'}`);
  };

  return <TarotApp onStart={handleStart} onSpreadSelect={handleSpreadSelect} />;
};

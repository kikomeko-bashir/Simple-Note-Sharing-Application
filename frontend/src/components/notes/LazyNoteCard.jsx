import React from 'react';
import { useLazyLoad } from '../../hooks/useLazyLoad.js';
import NoteCard from './NoteCard.jsx';
import { NoteCardSkeleton } from '../common/LoadingSkeleton.jsx';

const LazyNoteCard = (props) => {
  const [ref, isVisible] = useLazyLoad(0.1);

  return (
    <div ref={ref}>
      {isVisible ? (
        <NoteCard {...props} />
      ) : (
        <NoteCardSkeleton />
      )}
    </div>
  );
};

export default LazyNoteCard;

import { RepliesContext } from '../context/RepliesContext';
import { useContext } from 'react';

export const useRepliesContext = () => {
  const context = useContext(RepliesContext);

  if (!context) {
    throw Error('useRepliesContext must be used inside a RepliesContextProvider');
  };

  return context;
};

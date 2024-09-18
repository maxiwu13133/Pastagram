import { SearchContext } from '../context/SearchContext';
import { useContext } from 'react';

export const useSearchContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw Error('useSearchContext must be used inside a SearchContextProvider');
  };

  return context;
};

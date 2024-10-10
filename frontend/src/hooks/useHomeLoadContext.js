import { HomeLoadContext } from '../context/HomeLoadContext';
import { useContext } from 'react';

export const useHomeLoadContext = () => {
  const context = useContext(HomeLoadContext);

  if (!context) {
    throw Error('useHomeLoadContext must be used inside a HomeLoadContextProvider');
  };

  return context;
};

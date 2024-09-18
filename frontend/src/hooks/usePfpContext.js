import { PfpContext } from '../context/PfpContext';
import { useContext } from 'react';

export const usePfpContext = () => {
  const context = useContext(PfpContext);

  if (!context) {
    throw Error('usePfpContext must be used inside a PfpContextProvider');
  };

  return context;
};

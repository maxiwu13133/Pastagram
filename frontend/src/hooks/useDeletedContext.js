import { DeletedContext } from '../context/DeletedContext';
import { useContext } from 'react';

export const useDeletedContext = () => {
  const context = useContext(DeletedContext);

  if (!context) {
    throw Error('useDeletedContext must be used inside a DeletedContextProvider');
  };

  return context;
};

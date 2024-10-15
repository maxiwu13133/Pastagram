import { ProfileLoadContext } from '../context/ProfileLoadContext';
import { useContext } from 'react';

export const useProfileLoadContext = () => {
  const context = useContext(ProfileLoadContext);

  if (!context) {
    throw Error('useProfileLoadContext must be used inside a ProfileLoadContextProvider');
  };

  return context;
};

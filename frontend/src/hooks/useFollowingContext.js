import { FollowingContext } from '../context/FollowingContext';
import { useContext } from 'react';

export const useFollowingContext = () => {
  const context = useContext(FollowingContext);

  if (!context) {
    throw Error('useFollowingContext must be used inside a FollowingContextProvider');
  };

  return context;
};

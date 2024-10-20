import { NavbarContext } from '../context/NavbarContext';
import { useContext } from 'react';

export const useNavbarContext = () => {
  const context = useContext(NavbarContext);

  if (!context) {
    throw Error('useNavbarContext must be used inside a NavbarContextProvider');
  };

  return context;
};

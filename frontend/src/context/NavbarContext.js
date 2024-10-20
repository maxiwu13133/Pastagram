import { createContext, useReducer } from 'react';

export const NavbarContext = createContext();

export const navbarReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NAV':
      return { selectedNav: action.payload };
    default:
      return state;
  };
};

export const NavbarContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(navbarReducer, {
    selectedNav: ""
  });

  return (
    <NavbarContext.Provider value={{ ...state, dispatch }}>
      { children }
    </NavbarContext.Provider>
  );
};

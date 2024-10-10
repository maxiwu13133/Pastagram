import { createContext, useReducer } from 'react';

export const HomeLoadContext = createContext();

export const homeLoadReducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  };
};

export const HomeLoadContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(homeLoadReducer, {
    userInfoLoad: false,
    suggestedLoad: false,
    commentLoad: false
  });

  return (
    <HomeLoadContext.Provider value={{ ...state, dispatch }}>
      { children }
    </HomeLoadContext.Provider>
  );
};

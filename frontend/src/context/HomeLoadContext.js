import { createContext, useReducer } from 'react';

export const HomeLoadContext = createContext();

export const homeLoadReducer = (state, action) => {
  switch (action.type) {
    case 'SUGGEST_FINISH':
      return { ...state, suggestedLoad: true };
    case 'POST_FINISH':
      return { ...state, postLoad: true };
    case 'DELETED_FINISH':
      return { ...state, deletedLoad: true };
    default:
      return state;
  };
};

export const HomeLoadContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(homeLoadReducer, {
    suggestedLoad: false,
    postLoad: false,
    deletedLoad: false
  });

  return (
    <HomeLoadContext.Provider value={{ ...state, dispatch }}>
      { children }
    </HomeLoadContext.Provider>
  );
};

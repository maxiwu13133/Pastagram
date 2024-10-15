import { createContext, useReducer } from 'react';

export const ProfileLoadContext = createContext();

export const profileLoadReducer = (state, action) => {
  switch (action.type) {
    case 'SAVED_FINISH':
      return { ...state, savedLoad: true };
    case 'POST_FINISH':
      return { ...state, postLoad: true };
    default:
      return state;
  };
};

export const ProfileLoadContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileLoadReducer, {
    postLoad: false,
    savedLoad: false,
  });

  return (
    <ProfileLoadContext.Provider value={{ ...state, dispatch }}>
      { children }
    </ProfileLoadContext.Provider>
  );
};

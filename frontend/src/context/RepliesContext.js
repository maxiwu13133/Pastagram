import { createContext, useReducer } from 'react';

export const RepliesContext = createContext();

export const repliesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_REPLIES':
      return { replies: action.payload };
    default:
      return state;
  };
};

export const RepliesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(repliesReducer, {
    replies: null
  });

  return (
    <RepliesContext.Provider value={{ ...state, dispatch }}>
      { children }
    </RepliesContext.Provider>
  );
};

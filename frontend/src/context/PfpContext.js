import { createContext, useReducer, useEffect } from 'react';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';

export const PfpContext = createContext();

export const pfpReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PFP':
      return { pfp: action.payload };
    case 'REMOVE_PFP':
      return { pfp: null };
    default:
      return state;
  };
};

export const PfpContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pfpReducer, {
    pfp: null
  });
  const { user } = useAuthContext();

  useEffect(() => {
    const getPfp = async () => {
      const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/user/community/' + user.username, {
        method: 'GET'
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: 'SET_PFP', payload: json.pfp });
      };
    };

    if (user) {
      getPfp();
    }
  }, [user])

  return (
    <PfpContext.Provider value={{ ...state, dispatch }}>
      { children }
    </PfpContext.Provider>
  );
};

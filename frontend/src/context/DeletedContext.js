import { createContext, useReducer, useEffect } from 'react';


// hooks
import { useAuthContext } from '../hooks/useAuthContext';

export const DeletedContext = createContext();

export const deletedReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DELETED':
      return { deletedUsers: action.payload };
    default:
      return state;
  };
};

export const DeletedContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(deletedReducer, {
    deletedUsers: null
  });
  const { user } = useAuthContext();

  useEffect(() => {
    const getDeleted = async () => {
  
      const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/account/deleted/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ user.token }`
        }
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: 'SET_DELETED', payload: json.deleted });
      }
    }

    if (user) {
      getDeleted();
    }
  }, [user]);

  return (
    <DeletedContext.Provider value={{ ...state, dispatch }}>
      { children }
    </DeletedContext.Provider>
  );
};

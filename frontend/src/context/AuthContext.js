import { createContext, useReducer, useEffect } from 'react';
import { isExpired } from 'react-jwt';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, loadFinish: true };
    case 'LOGOUT':
      localStorage.removeItem('user');
      return { user: null, loadFinish: true };
    default:
      return state;
  };
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loadFinish: false,
  });

  // Check if user has logged in recently
  useEffect(() => {

    // slight load in time to make app feel like it's doing something
    setTimeout(() => {
      
      const user = JSON.parse(localStorage.getItem('user'));

      // Logs out and removes token from local storage if expired
      if (user) {
        if (isExpired(user.token)) {
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT', payload: null });
        } else {
          dispatch({ type: 'LOGIN', payload: user });
        };
      } else {
        dispatch({ type: 'LOGOUT', payload: null });
      };
    }, 200);

  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  );
};

import { createContext, useReducer, useEffect } from 'react';


// hooks
import { useAuthContext } from '../hooks/useAuthContext';


export const FollowingContext = createContext();

export const followingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FOLLOWING':
      return { followingListGlobal: action.payload };
    case 'REMOVE_FOLLOWING':
      return { followingListGlobal: state.followingListGlobal.filter(x => x !== action.payload) };
    case 'ADD_FOLLOWING':
      return { followingListGlobal: state.followingListGlobal.concat(action.payload) };
    default:
      return state;
  };
};

export const FollowingContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(followingReducer, {
    followingListGlobal: null
  });
  const { user } = useAuthContext();
  
  useEffect(() => {
    const getFollowing = async () => {
      const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/user/community/' + user.username, {
        method: 'GET'
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: 'SET_FOLLOWING', payload: json.following });
      };
    };

    if (user) {
      getFollowing();
    }
  }, [user])


  return (
    <FollowingContext.Provider value={{ ...state, dispatch }}>
      { children }
    </FollowingContext.Provider>
  );
};

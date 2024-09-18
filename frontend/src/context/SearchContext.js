import { createContext, useReducer, useEffect } from 'react';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';

export const SearchContext = createContext();

export const searchReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCHES':
      return { recentSearches: action.payload, openModal: false };
    case 'ADD_SEARCH':
      const filteredSearches = state.recentSearches.filter(search => search._id !== action.payload._id);
      return { recentSearches: [action.payload, ...filteredSearches], openModal: false };
    case 'REMOVE_SEARCH':
      return { 
        recentSearches: state.recentSearches.filter(search => search._id !== action.payload._id),
        openModal: state.openModal
      };
    case 'CLEAR_SEARCH':
      return { recentSearches: [], openModal: state.openModal };
    case 'OPEN_MODAL':
      return { recentSearches: state.recentSearches, openModal: true };
    case 'CLOSE_MODAL':
      return { recentSearches: state.recentSearches, openModal: false };
    default:
      return state;
  };
};

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, {
    recentSearches: null,
    openModal: false
  });
  const { user } = useAuthContext();

  useEffect(() => {
    const getSearches = async () => {
      const response = await fetch('http://localhost:4000/api/search/' + user.username, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ user.token }`
        }
      })
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: 'SET_SEARCHES', payload: json.searches });
      }
    }

    if (user) {
      getSearches();
    }
  }, [user])

  return (
    <SearchContext.Provider value={{ ...state, dispatch }}>
      { children }
    </SearchContext.Provider>
  );
};

import { Link } from 'react-router-dom';
import './index.css';

// hooks
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useSearchContext } from '../../../hooks/useSearchContext';
import { useUpdateSearches } from '../../../hooks/useUpdateSearches';

// assets
import defaultPfp from '../../../assets/Profile/default-pfp.jpg';
import closeButton from '../../../assets/Search/close-button-gray.png';

const Results = ({ searchTerm, setSearchTerm, results }) => {
  const { user } = useAuthContext();
  const { recentSearches, dispatch } = useSearchContext();
  const { addSearch, removeSearch, clearSearch } = useUpdateSearches();

  // add search to recents
  const handleClick = ({ e, result, remove }) => {
    if(e && e.stopPropagation) e.stopPropagation();

    if (remove) {
      dispatch({
        type: 'REMOVE_SEARCH',
        payload: { _id: result._id }
      });
      removeSearch({ username: user.username, search: result._id });
    }

    if (!remove) {
      setSearchTerm('');
      dispatch({
        type: 'ADD_SEARCH',
        payload: { _id: result._id, username: result.username, pfp: result.pfp, fullName: result.fullName }
      });
      addSearch({ username: user.username, search: result._id });
    }
  }

  // clear search history
  const handleClear = () => {
    dispatch({ type: 'CLEAR_SEARCH' });
    clearSearch({ username: user.username });
  }

  // format results
  const formatUser = ({ result, i, close }) => {
    return (
      <div className="results-user-container" key={ i } onClick={ () => handleClick({ result, remove: false }) }>
        <Link to={ `/${ result.username }` } className="results-user">
          <img src={ result.pfp ? result.pfp.url : defaultPfp } alt="" className="results-pfp" draggable={ false } />
    
          <div className="results-details">
            <div className="results-username">
              { result.username }
            </div>
    
            <div className="results-fullname">
              { result.fullName }
            </div>
          </div>
        </Link>
      
        {
          close && 
          <div className="results-close-container" onClick={ (e) => handleClick({ e, result, remove: true }) }>
            <img src={ closeButton } alt="" className="results-close-icon" />
          </div>
        }
      </div>
    )
  }

  return ( 
    <div className="results-container">
      <div className="results-header">
        {
          searchTerm.replace(/\s+/g, '').length === 0 && 
          <div className="results-title">
            Recent
          </div>
        }

        {/* Clear all button */}
        { 
          recentSearches && 
          recentSearches.length !== 0 &&
          searchTerm.replace(/\s+/g, '').length === 0 && 
          <button className="results-clear" onClick={ () => handleClear() }>
            Clear all
          </button>
        }
      </div>

      <div className="results-results-container">

        {/* No recent searches */}
        { 
          recentSearches && 
          recentSearches.length === 0 && 
          searchTerm.replace(/\s+/g, '').length === 0 &&
          <div className="results-empty">
            No recent searches.
          </div>
        }

        
        {/* Recent searches */}
        {
          recentSearches && 
          recentSearches.length !== 0 &&
          searchTerm.replace(/\s+/g, '').length === 0 &&
          recentSearches.map((result, i) => formatUser({ result, i, close: true }))
        }

        {/* Search results */}
        {
          searchTerm.replace(/\s+/g, '').length !== 0 &&
          results.map((result, i) => formatUser({ result, i }))
        }

      </div>
    </div>
   );
}
 
export default Results;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

// hooks
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGetSearches } from '../../../hooks/useGetSearches';
// import { useUpdateSearches } from '../../../hooks/useUpdateSearches';

// assets
import defaultPfp from '../../../assets/Profile/default-pfp.jpg';

const Results = ({ searchTerm, results }) => {
  const { user } = useAuthContext();
  const { searches: s } = useGetSearches({ username: user.username });
  // const { addSearch, removeSearch } = useUpdateSearches();

  // get searches
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    setSearches(s);
  }, [s])

  // format results
  const formatUser = (result, i) => {
    return (
      <Link to={ `/${ result.username }` }>
        <div className="results-user" key={ i } >
          <img src={ result.pfp ? result.pfp.url : defaultPfp } alt="" className="results-pfp" draggable={ false } />
    
          <div className="results-details">
            <div className="results-username">
              { result.username }
            </div>
    
            <div className="results-fullname">
              { result.fullName }
            </div>
          </div>
        </div>
      </Link>
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
          searches.length !== 0 &&
          searchTerm.replace(/\s+/g, '').length !== 0 && 
          <button className="results-clear">
            Clear all
          </button>
        }
      </div>

      <div className="results-results-container">

        {/* No recent searches */}
        { 
          searches.length === 0 && 
          searchTerm.replace(/\s+/g, '').length === 0 &&
          <div className="results-empty">
            No recent searches.
          </div>
        }

        
        {/* Recent searches */}
        {
          <div className="results-recent">

          </div>
        }

        {/* Search results */}
        {
          searchTerm.replace(/\s+/g, '').length !== 0 &&
          results.map((result, i) => formatUser(result, i))
        }

      </div>
    </div>
   );
}
 
export default Results;
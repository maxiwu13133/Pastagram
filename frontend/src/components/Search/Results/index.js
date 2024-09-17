import { useState, useEffect } from 'react';
import './index.css';

// hooks
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGetSearches } from '../../../hooks/useGetSearches';
// import { useUpdateSearches } from '../../../hooks/useUpdateSearches';

const Results = () => {
  const { user } = useAuthContext();
  const { searches: s } = useGetSearches({ username: user.username });
  // const { addSearch, removeSearch } = useUpdateSearches();

  // get searches
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    setSearches(s);
  }, [s])

  return ( 
    <div className="results-container">
      <div className="results-header">
        <div className="results-title">
          Recent
        </div>

        <button className="results-clear">
          Clear all
        </button>
      </div>

      <div className="results-searches">
        { searches }
      </div>
    </div>
   );
}
 
export default Results;
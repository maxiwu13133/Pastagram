import { useState, useEffect, forwardRef } from 'react';
import { useDebounce } from 'use-debounce';
import './index.css';


// assets
import magnifyGlass from '../../assets/Navbar/ig-search-icon-unfocused.png';
import close from '../../assets/Search/circle-close.png';


// components
import Results from './Results';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useSearchContext } from '../../hooks/useSearchContext';
import { useDeletedContext } from '../../hooks/useDeletedContext';


const Search = forwardRef((_, ref) => {
  const { user } = useAuthContext();
  const { openModal } = useSearchContext();

  // deleted users
  const { deletedUsers } = useDeletedContext();


  // change search bar styling when focused
  const [inputFocus, setInputFocus] = useState(false);


  // get search input value
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 300);


  // search results when search bar has value
  const [results, setResults] = useState([]);


  // debounce search for optimization
  useEffect(() => {
    if (debouncedSearch) {
      const searchUsers = async (value) => {
        const processedValue = value.toLowerCase().replace(/\s+/g, '');
        if (processedValue.length !== 0) {
          const response = await fetch('http://localhost:4000/api/search/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${ user.token }`
            }
          })
          const json = await response.json();

          if (!response.ok) {
            console.log('Error:', json.error);
          }
          if (response.ok) {
            const deletedRemoved = json.users.filter(x => !deletedUsers.includes(x._id));
            const filteredResults = deletedRemoved.filter(user => user.username.toLowerCase().includes(processedValue));
            setResults(filteredResults);
          }
        }
      }
      searchUsers(debouncedSearch);
    }
  }, [debouncedSearch, user.token, deletedUsers]);


  return ( 
    <div className={ `search-container ${ openModal ? "search-container-show" : "search-container-hide"}` } ref={ ref }>
      <div className="search-header">
        <div className="search-title">
          Search
        </div>
        <div className="search-bar">
          <img 
            src={ magnifyGlass }
            alt=""
            className={ `search-bar-icon ${ inputFocus ? "search-bar-icon-hide" : "" }` }
          />

          <input 
            name="search"
            type="text"
            className={ `search-bar-input ${ inputFocus ? "" : "search-bar-input-unfocused" }` }
            placeholder="Search"
            onFocus={ () => setInputFocus(true) }
            onBlur={ () => setInputFocus(false) }
            onChange={ (e) => setSearchTerm(e.target.value) }
            value={ searchTerm }
          />

          <img
            src={ close }
            alt=""
            className={ `search-bar-close ${ 
              inputFocus ? "search-bar-close-show" : 
              searchTerm.length === 0 ? "" : 
              "search-bar-close-show" 
            }` }
            onClick={ () => setSearchTerm('') }
            onFocus={ () => setInputFocus(true) }
          />
        </div>
      </div>

      <div className="search-results-container">
        <Results searchTerm={ searchTerm } setSearchTerm={ setSearchTerm } results={ results } />
      </div>
    </div>
   );
});
 
export default Search;
import { useState } from 'react';
import './index.css';

// assets
import magnifyGlass from '../../assets/Navbar/ig-search-icon-unfocused.png';
import close from '../../assets/Search/circle-close.png';

// components
import Results from './Results';

// hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useSearchContext } from '../../hooks/useSearchContext';

const Search = () => {
  const { user } = useAuthContext();
  const { openModal, dispatch } = useSearchContext();

  // change search bar styling when focused
  const [inputFocus, setInputFocus] = useState(false);

  // get search input value
  const [searchTerm, setSearchTerm] = useState('');

  // search results when search bar has value
  const [results, setResults] = useState([]);

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
        const filteredResults = json.users.filter(user => user.username.toLowerCase().includes(processedValue));
        setResults(filteredResults);
      }
    }
  }

  const handleChange = (value) => {
    setSearchTerm(value);
    searchUsers(value);
  }

  return ( 
    <div className={ `search-container ${ openModal ? "search-container-show" : "search-container-hide"}` } >
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
            type="text"
            className={ `search-bar-input ${ inputFocus ? "" : "search-bar-input-unfocused" }` }
            placeholder="Search"
            onFocus={ () => setInputFocus(true) }
            onBlur={ () => setInputFocus(false) }
            onChange={ (e) => handleChange(e.target.value) }
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
};
 
export default Search;
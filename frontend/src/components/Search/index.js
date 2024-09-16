import { useState } from 'react';
import './index.css';

// assets
import magnifyGlass from '../../assets/Navbar/ig-search-icon-unfocused.png';
import close from '../../assets/Search/circle-close.png';

const Search = ({ searchOpen }) => {
  
  // change search bar styling when focused
  const [inputFocus, setInputFocus] = useState(false);

  // get search input value
  const [searchTerm, setSearchTerm] = useState('');

  return ( 
    <div className={ `search-container ${ searchOpen ? "search-container-show" : "search-container-hide"}` } >
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
        <div className="search-recent">
          Recent
        </div>

        <div className="search-results">

        </div>
      </div>
    </div>
   );
};
 
export default Search;
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import './index.css';


// assets
import closeButton from '../../assets/PostView/close-button-black.png';
import magnifyGlass from '../../assets/Navbar/ig-search-icon-unfocused.png';
import circleClose from '../../assets/Search/circle-close.png';
import defaultPfp from '../../assets/Profile/default-pfp.jpg';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useDeletedContext } from '../../hooks/useDeletedContext';


const FriendsModal = ({ setFriendsModal, type, followers, following }) => {
  const { user } = useAuthContext();
  

  // deleted users
  const { deletedUsers } = useDeletedContext();


  // search
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  // results
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
            const filteredResults = deletedRemoved.filter(x => x.username.toLowerCase().includes(processedValue));

            if (type === 'Followers') {
              setResults(filteredResults.filter(x => followers.includes(x._id)));
            }

            if (type === 'Following') {
              setResults(filteredResults.filter(x => following.includes(x._id)));
            }
          }
        }
      }
      searchUsers(debouncedSearch);
    }
  }, [debouncedSearch, user.token, deletedUsers, followers, following, type]);

  useEffect(() => {
    console.log(results);
  }, [results])


  return (
    <div>
      <div className="friends-overlay" onClick={ () => setFriendsModal(false) } />

      <div className="friends-container">

        {/* header */}
        <div className="friends-header">
          <p className="friends-title">
            { type }
          </p>

          <div className="friends-close">
            <img 
              src={ closeButton }
              alt=""
              className="friends-close-icon"
              draggable={ false }
              onClick={ () => setFriendsModal(false) }
            />
          </div>
        </div>

        {/* search */}
        <div className="friends-search">
          <div className="friends-input-container">
            <img 
              src={ magnifyGlass }
              alt=""
              className={ `friends-input-icon ${ searchTerm === '' ? "" : "remove" }` }
              draggable={ false }
            />

            <input 
              type="text"
              className="friends-input"
              placeholder="Search"
              onChange={ (e) => setSearchTerm(e.target.value) }
              value={ searchTerm }
            />

            <div className="friends-input-close-container">
              <img
                src={ circleClose }
                alt=""
                className={ `friends-input-close ${ searchTerm === '' ? "remove" : "" }` }
                draggable={ false }
              />
            </div>
          </div>
        </div>

        {/* results */}
        <div className="friends-results">
          
        </div>
      </div>
    </div>
  )
}

export default FriendsModal;